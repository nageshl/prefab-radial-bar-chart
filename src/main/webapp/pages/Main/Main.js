/*
 * Use App.getDependency for Dependency Injection
 * eg: var DialogService = App.getDependency('DialogService');
 */

/*
 * This function will be invoked when any of this prefab's property is changed
 * @key: property name
 * @newVal: new value of the property
 * @oldVal: old value of the property
 */
Prefab.onPropertyChange = function(key, newVal, oldVal) {
    switch (key) {
        case "chartdata":
            Prefab.init();
            break;
    }
};

Prefab.onReady = function() {
    // this method will be triggered post initialization of the prefab.
    Prefab.init();

};

Prefab.init = function() {
    const width = Prefab.chartheight || 300,
        height = Prefab.chartwidth || 300,
        chartRadius = height / 2 - 40;


    const color = Prefab.chartcolors || ['#00c2ea', '#81c447', '#F71919', '#FFFF00'];
    // BEGIN ####
    // access specific prefab-container using its 'widget-id' (unique)
    let widget_id = Prefab.Widgets.prefab_container1.widgetId;
    // select child div of prefab container, where the chart needs to be rendered.
    d3.select('div[widget-id="' + widget_id + '"]>div').html("");
    // END #### 
    let svg = d3.select('.mainCont').append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    let tooltip = d3.select('.mainCont').append('div')
        .attr('class', 'tooltip');

    const PI = Math.PI,
        arcMinRadius = 10,
        arcPadding = 10,
        labelPadding = -5,
        numTicks = 10;

    var staticData = [{
        name: "On-Time",
        value: 432
    }, {
        name: "Completed",
        value: 310
    }, {
        name: "OverDue",
        value: 132
    }, {
        name: "Pending Sign-Off",
        value: 200
    }];

    var data = Prefab.chartdata || staticData;


    let scale = d3.scale.linear()
        .domain([0, d3.max(data, d => d.value) * 1.1])
        .range([0, 2 * PI]);

    let ticks = scale.ticks(numTicks).slice(0, -1);
    let keys = data.map((d, i) => d.name);
    //number of arcs
    const numArcs = keys.length;
    const arcWidth = (chartRadius - arcMinRadius - numArcs * arcPadding) / numArcs;

    let arc = d3.svg.arc()
        .innerRadius((d, i) => getInnerRadius(i))
        .outerRadius((d, i) => getOuterRadius(i))
        .startAngle(0)
        .endAngle((d, i) => scale(d))

    let radialAxis = svg.append('g')
        .attr('class', 'r axis')
        .selectAll('g')
        .data(data)
        .enter().append('g');

    radialAxis.append('circle')
        .attr('r', (d, i) => getOuterRadius(i) + arcPadding);

    radialAxis.append('text')
        .attr('x', labelPadding)
        .attr('y', (d, i) => -getOuterRadius(i) + arcPadding)
        .text(d => d.name);

    let axialAxis = svg.append('g')
        .attr('class', 'a axis')
        .selectAll('g')
        .data(ticks)
        .enter().append('g')
        .attr('transform', d => 'rotate(' + (rad2deg(scale(d)) - 90) + ')');

    axialAxis.append('line')
        .attr('x2', chartRadius);

    axialAxis.append('text')
        .attr('x', chartRadius + 10)
        .style('text-anchor', d => (scale(d) >= PI && scale(d) < 2 * PI ? 'end' : null))
        .attr('transform', d => 'rotate(' + (90 - rad2deg(scale(d))) + ',' + (chartRadius + 10) + ',0)')
        .text(d => d);

    //data arcs
    let arcs = svg.append('g')
        .attr('class', 'data')
        .selectAll('path')
        .data(data)
        .enter().append('path')
        .attr('class', 'arc')
        .style('fill', (d, i) => color[i % 6])

    arcs.transition()
        .delay((d, i) => i * 200)
        .duration(1000)
        .attrTween('d', arcTween);

    arcs.on('mousemove', showTooltip)
    arcs.on('mouseout', hideTooltip)


    function arcTween(d, i) {
        let interpolate = d3.interpolate(0, d.value);
        return t => arc(interpolate(t), i);
    }

    function showTooltip(d) {
        var coordinates = d3.mouse(d3.select('.mainCont').node());
        tooltip.style('left', (coordinates[0] + 10) + 'px')
            .style('top', (coordinates[1] - 25) + 'px')
            .style('display', 'inline-block')
            .html(d.value);
    }

    function hideTooltip() {
        tooltip.style('display', 'none');
    }

    function rad2deg(angle) {
        return angle * 180 / PI;
    }

    function getInnerRadius(index) {
        return arcMinRadius + (numArcs - (index + 1)) * (arcWidth + arcPadding);
    }

    function getOuterRadius(index) {
        return getInnerRadius(index) + arcWidth;
    }
};
