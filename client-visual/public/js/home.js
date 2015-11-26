console.log('outside');
var da = Math.random();
var db = Math.random()*(1-da);
var dc = 1 - (da+db);

console.log('da :' + da);
console.log('db :' + db);
console.log('dc :' + dc);

var data;

function pullData(){
var da = Math.random();
var db = Math.random()*(1-da);
var dc = 1 - (da+db);

console.log('da :' + da);
console.log('db :' + db);
console.log('dc :' + dc);

data = {
    pieChart  : [
      {
        color       : 'red',
        description : 'Negativo',
        title       : 'Negativo',
        value       : da
      },
      {
        color       : 'gray',
        description : 'Neutro',
        title       : 'Neutro',
        value       : db
      },
      {
        color       : 'blue',
        description : 'Positivo',
        title       : 'Positivo',
        value       : dc
      }
    ]
  };
};

var DURATION = 1500;
var DELAY    = 500;

function drawPieChart( elementId, data ) {
    // TODO code duplication check how you can avoid that

    var containerEl = document.getElementById(elementId);
    var width       = containerEl.clientWidth;
    console.log("containerEl.clientWidth "+containerEl.clientWidth);
    var height      = width * 0.5 ,
        radius      = 0.6*Math.min( width, height ) / 2,
        container   = d3.select( containerEl ),
        svg         = container.select( 'svg' )
                              .attr( 'width', width )
                              .attr( 'height', height );
    var pie = svg.append( 'g' )
                .attr(
                  'transform',
                  'translate(' + width / 2 + ',' + (-70 + height / 2) + ')'
                )
                .attr(
                  'class',
                  'pieChart--g');
    
    var detailedInfo = svg.append( 'g' )
                          .attr( 'class', 'pieChart--detailedInformation' );

    var twoPi   = 2 * Math.PI;
    var pieData = d3.layout.pie()
                    .value( function( d ) { return d.value; } );

    var arc = d3.svg.arc()
                    .outerRadius( radius - 10)
                    .innerRadius( 0 );

    var counterPieces = 0;
    
    var pieChartPieces = pie.datum( data )
                            .selectAll( 'path' )
                            .data( pieData )
                            .enter()
                            .append( 'path' )
                            .attr( 'class', function( d ) {
                              return 'pieChart__' + d.data.color;
                            } )
                            .attr( 'filter', 'url(#pieChartInsetShadow)' )
                            .attr( 'd', arc )
                            .each( function() {
                              this._current = { startAngle: 0, endAngle: 0 }; 
                            } )
                            .transition()
                            .duration( DURATION )
                            .attrTween( 'd', function( d ) {
                              var interpolate = d3.interpolate( this._current, d );
                              this._current = interpolate( 0 );
                    
                              return function( t ) {
                                return arc( interpolate( t ) );
                              };
                            } )
                            .each( 'end', function handleAnimationEnd( d ) {
                              drawDetailedInformation( d.data, this, counterPieces); 
                              counterPieces++;
                            } );

    drawChartCenter(); 
    
    function drawChartCenter() {
      var centerContainer = pie.append( 'g' )
                                .attr( 'class', 'pieChart--center' );
      
      centerContainer.append( 'circle' )
                      .attr( 'class', 'pieChart--center--outerCircle' )
                      .attr( 'r', 0 )
                      .attr( 'filter', 'url(#pieChartDropShadow)' )
                      .transition()
                      .duration( DURATION )
                      .delay( DELAY )
                      .attr( 'r', radius - 50 );
      
      centerContainer.append( 'circle' )
                      .attr( 'id', 'pieChart-clippy' )
                      .attr( 'class', 'pieChart--center--innerCircle' )
                      .attr( 'r', 0 )
                      .transition()
                      .delay( DELAY )
                      .duration( DURATION )
                      .attr( 'r', radius - 60 )
                      .attr( 'fill', '#fff' );
    }
    
    function drawDetailedInformation ( data, element, ind ) {
      var bBox      = element.getBBox(),
          infoWidth = width * 0.25,
          anchor,
          infoContainer,
          position;

      infoContainer = detailedInfo.append( 'g' )
                                    .attr( 'width', infoWidth )
                                    .attr(
                                      'transform',
                                      'translate(' + ( (width/3)*ind + 20 ) + ',' + ( height - 100 ) + ')'
                                    );


      anchor   = 'end';
      position = 'right';

      infoContainer.data( [ data.value * 100 ] )
                    .append( 'text' )
                    .text ( '0 %' )
                    .attr( 'class', 'pieChart--detail--percentage--' + ind )
                    .attr( 'x', ( position === 'left' ? 0 : infoWidth ) )
                    .attr( 'y', -10 )
                    .attr( 'text-anchor', anchor )
                    .transition()
                    .duration( DURATION )
                    .tween( 'text', function( d ) {
                      var i = d3.interpolateRound(
                        +this.textContent.replace( /\s%/ig, '' ),
                        d
                      );

                      return function( t ) {
                        this.textContent = i( t ) + ' %';
                      };
                    } );
      
      infoContainer.append( 'line' )
                    .attr( 'class', 'pieChart--detail--divider' )
                    .attr( 'x1', 0 )
                    .attr( 'x2', 0 )
                    .attr( 'y1', 0 )
                    .attr( 'y2', 0 )
                    .transition()
                    .duration( DURATION )
                    .attr( 'x2', infoWidth );
      
      infoContainer.data( [ data.description ] ) 
                    .append( 'foreignObject' )
                    .attr( 'width', infoWidth ) 
                    .attr( 'height', 40 )
                    .append( 'xhtml:body' )
                    .attr(
                      'class',
                      'pieChart--detail--textContainer ' + 'pieChart--detail__' + position
                    )
                    .html( data.description );
    }
}



jQuery(document).ready(function(){
	console.log('document is ready');
  
  $(document).on('click','#btnSearch',function(){
    console.log('Button pressed');
    $('.pieChart--detailedInformation').remove();
    $('.pieChart--g').remove();
    pullData();
    drawPieChart('pieChart', data.pieChart);
    return false;
  });
});