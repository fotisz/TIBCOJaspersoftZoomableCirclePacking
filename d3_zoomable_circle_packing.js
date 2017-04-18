define(['d3'], function (d3) {

	 return function (instanceData) {	
		
	 			var root = { name: "data", children: [] };

                // Build the tree...
                var series0 = instanceData.series[0];
                
                var currentCategory = "";
                for (var index = 0; index < series0.length; ++index) {
                    
                    var record = series0[index];
                    
                    if ( currentCategory != record.category )
                    {
                        currentCategory = record.category;
                        
                        var categoryObject = { name: currentCategory, children: [] };
                        
                        // populate sub categories
                        for (var index2 = 0; index2 < series0.length; ++index2) {
                            var subrecord = series0[index2];
                            if (subrecord.category == currentCategory)
                            {
                                categoryObject.children.push({ name: subrecord.subcategory, size: subrecord.value });
                            }
                        }
                        root.children.push( categoryObject );
                    }
                 } 

                 var w = instanceData.width,
                     h = instanceData.height;

                var margin = 20,
                    diameter = 960;

                diameter = Math.min(w, h); 
                    
                var color = d3.scale.linear()
				    .domain([-1, 5])
				    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
				    .interpolate(d3.interpolateHcl);
				
				var pack = d3.layout.pack()
				    //.padding(2)
				    .size([diameter - margin, diameter - margin])
				    .value(function(d) { return d.size; })
				
				var svg = d3.select("#" + instanceData.id).insert("svg")
					.attr("id", instanceData.id + "svg")
					.attr("width", w)
				    .attr("height", h)
				  .append("g")
				    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");
				
				
				  var focus = root,
				      nodes = pack.nodes(root),
				      view;
				
				  var circle = svg.selectAll("circle")
				      .data(nodes)
				    .enter().append("circle")
				      .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
				      .style("fill", function(d) { return d.children ? color(d.depth) : null; })
				      .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });
				
				  var text = svg.selectAll("text")
				      .data(nodes)
				    .enter().append("text")
				      .attr("class", "label")
				      .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
				      .style("display", function(d) { return d.parent === root ? null : "none"; })
				      .text(function(d) { return d.name; });
				
				  var node = svg.selectAll("circle,text");
				
				  zoomTo([root.x, root.y, root.r * 2 + margin]);
				
				  function zoom(d) {
				    var focus0 = focus; focus = d;
				
				    var transition = d3.transition()
					.duration(d3.event.altKey ? 7500 : 750)
					.tween("zoom", function(d) {
					  var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
					  return function(t) { zoomTo(i(t)); };
					});
				
				    transition.selectAll("text")
				      .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
					.style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
					.each("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
					.each("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
				  }
				
				  function zoomTo(v) {
				    var k = diameter / v[2]; view = v;
				    node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
				    circle.attr("r", function(d) { return d.r * k; });
				  }
				
				d3.select(self.frameElement).style("height", diameter + "px");

		
	};
		
});

