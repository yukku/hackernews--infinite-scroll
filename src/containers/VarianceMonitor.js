// Use this component only for debugging

import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import './VarianceMonitor.css';

class TimeSerisChart {
  constructor() {
    this.xShape = 51;
    this.xSlider = 0;
    this.data = [];
    this.initialAverageStoryOccurrenceRatio = undefined;
    this.ratioData = [];
    this.width = 400;
    this.height = 300;
  }

  initialAverageStoryOccurrenceRatioIsUndefined() {
    return this.initialAverageStoryOccurrenceRatio === undefined;
  }

  getInitialAverageStoryOccurrenceRatio() {
    return this.initialAverageStoryOccurrenceRatio;
  }

  setInitialAverageStoryOccurrenceRatio(value) {
    this.initialAverageStoryOccurrenceRatio = value;
  }

  initialize({ container }) {
    this.x = d3.scaleLinear().range([0, this.width - 60]);
    this.y = d3.scaleLinear().range([this.height - 50, 0]);

    this.xAxis = d3.axisBottom(this.x);
    this.yAxis = d3.axisLeft(this.y);

    this.line = d3
      .line()
      .x((d, i) => this.x(this.xSlider + i))
      .y(d => this.y(d));

    this.svg = d3
      .select(container)
      .append('svg')
      .attr('class', 'monitor')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', 'translate(40, 20)');

    this.xAxisShape = this.svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${this.height - 50})`)
      .call(this.xAxis);

    this.yAxisShape = this.svg
      .append('g')
      .attr('class', 'y axis')
      .call(this.yAxis);

    this.dataShape = this.svg.append('path').attr('class', 'line data');
    this.ratioDataShape = this.svg.append('path').attr('class', 'line ratio-data');
  }

  update(updatedStoriesVariance: number = 0, averageStoryOccurrenceRatio: number = 0) {
    if (this.data.length > this.xShape - 1) {
      this.data.shift();
      this.ratioData.shift();
      this.xSlider += 1;
    }

    this.data.push(updatedStoriesVariance);
    this.ratioData.push(averageStoryOccurrenceRatio);

    this.x.domain([this.xSlider, this.xSlider + this.xShape - 1]);

    // auto adjust y axis range
    // this.yDom = d3.extent(this.data);
    // this.yDom[0] = Math.max(this.yDom[0] - 1, 0);
    // this.yDom[1] += 1;

    this.yDom = [-50, 50];
    this.y.domain(this.yDom);

    this.xAxisShape.call(this.xAxis);
    this.yAxisShape.call(this.yAxis);

    this.dataShape.datum(this.data).attr('d', this.line);
    this.ratioDataShape.datum(this.ratioData).attr('d', this.line);
  }
}

class VarianceMonitor extends React.Component {
  constructor(props) {
    super(props);
    this.container = React.createRef();
    this.timeSerisChart = new TimeSerisChart();
  }

  componentDidMount() {
    this.timeSerisChart.initialize({
      container: this.container.current
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.stories.length !== nextProps.stories.length;
  }

  componentDidUpdate(prevProps, prevState) {
    const updatedStoriesLength = this.props.stories.length - prevProps.stories.length;

    if (this.timeSerisChart.initialAverageStoryOccurrenceRatioIsUndefined()) {
      this.timeSerisChart.setInitialAverageStoryOccurrenceRatio(
        this.props.averageStoryOccurrenceRatio
      );
    }

    const averageStoryOccurrenceRatioDiff =
      this.props.averageStoryOccurrenceRatio -
      this.timeSerisChart.getInitialAverageStoryOccurrenceRatio();

    this.timeSerisChart.update(updatedStoriesLength - 50, averageStoryOccurrenceRatioDiff * 200);
  }

  render() {
    return <div className="variance-monitor" ref={this.container} />;
  }
}

const mapStateToProps = state => {
  return {
    averageStoryOccurrenceRatio: state.averageStoryOccurrenceRatio,
    stories: state.stories
  };
};

export default connect(mapStateToProps)(VarianceMonitor);
