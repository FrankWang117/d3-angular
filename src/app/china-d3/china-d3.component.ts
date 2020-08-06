import { Component, OnInit } from '@angular/core';
import { select, scaleLinear, json, geoMercator, geoPath, csv } from 'd3';

@Component({
  selector: 'app-china-d3',
  templateUrl: './china-d3.component.html',
  styleUrls: ['./china-d3.component.scss'],
})
export class ChinaD3Component implements OnInit {
  constructor() {}

  paths: any;

  ngOnInit(): void {
    this.initMap();
  }
  initMap() {
    const width = 960;
    const height = 960;
    const container = select('.china-d3');

    const svg = container
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background-color', '#FAFBFC');

    const maxData = 1700;
    const minData = 0;

    const color = scaleLinear()
      .domain([minData, maxData])
      .range([
        ('#B8D4FA' as unknown) as number,
        ('#18669A' as unknown) as number,
      ]);
    json('./assets/geojson/china.json')
      .then((geoJson: any) => {
        const projection = geoMercator().fitSize([width, height], geoJson);
        const path = geoPath().projection(projection);

        this.paths = svg
          .selectAll('path.map')
          .data(geoJson.features)
          .enter()
          .append('path')
          .classed('map', true)
          .attr('fill', '#348fe4')
          .attr('stroke', 'white')
          .attr('class', 'continent')
          .attr('d', path)
          .on('mouseover', function (d: any) {
            select(this).classed('path-active', true);
          })
          .on('mouseout', function (d: any) {
            select(this).classed('path-active', false);
          });

        // const t = animationType();
        return csv('./assets/geojson/data2.csv');
      })
      .then((totalData) => {
        const data = totalData[totalData.length - 1];
        console.log(data);
        this.paths
          .transition()
          .duration(1000)
          .attr('fill', (d: any) => {
            const curProvData = data[d.properties.name];
            return color(curProvData ? (+curProvData as number) : 0);
          });
      });
    // 显示渐变矩形条
    // const linearGradient = svg
    //   .append('defs')
    //   .append('linearGradient')
    //   .attr('id', 'linearColor')
    //   //颜色渐变方向
    //   .attr('x1', '0%')
    //   .attr('y1', '100%')
    //   .attr('x2', '0%')
    //   .attr('y2', '0%');
    // // //设置矩形条开始颜色
    // linearGradient
    //   .append('stop')
    //   .attr('offset', '0%')
    //   .attr('stop-color', '#8ABCF4');
    // // //设置结束颜色
    // linearGradient
    //   .append('stop')
    //   .attr('offset', '100%')
    //   .attr('stop-color', '#18669A');

    // svg
    //   .append('rect')
    //   //x,y 矩形的左上角坐标
    //   .attr('x', layout.getPadding().pl)
    //   .attr('y', layout.getHeight() - 83 - layout.getPadding().pb) // 83为矩形的高
    //   //矩形的宽高
    //   .attr('width', 16)
    //   .attr('height', 83)
    //   //引用上面的id 设置颜色
    //   .style('fill', 'url(#' + linearGradient.attr('id') + ')');
    // //设置文字

    // // 数据初值
    // svg
    //   .append('text')
    //   .attr('x', layout.getPadding().pl + 16 + 8)
    //   .attr('y', layout.getHeight() - layout.getPadding().pb)
    //   .text(0)
    //   .classed('linear-text', true);
    // // visualMap title
    // svg
    //   .append('text')
    //   .attr('x', layout.getPadding().pl)
    //   .attr('y', layout.getHeight() - 83 - layout.getPadding().pb - 8) // 8为padding
    //   .text('市场规模')
    //   .classed('linear-text', true);
    // //数据末值
    // svg
    //   .append('text')
    //   .attr('x', layout.getPadding().pl + 16 + 8)
    //   .attr('y', layout.getHeight() - 83 - layout.getPadding().pb + 12) // 12 为字体大小
    //   .text(format('~s')(maxData))
    //   .classed('linear-text', true);
  }
}
