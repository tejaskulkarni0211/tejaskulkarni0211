d3.queue()
    .defer(d3.json, "//unpkg.com/world-atlas@1.1.4/world/50m.json")
    .defer(d3.csv, "country_data.csv", function(row){
        return{
            country: row.country,
            countryCode: +row.countryCode,
            population: +row.population,
            medianAge: +row.medianAge,
            fertilityRate: +row.fertilityRate,
            populationDensity: +row.population / +row.landArea
        }
    })
    .await(function(error, mapData, populationData){
    if(error) throw error;

    var geoData = topojson.feature(mapData, mapData.objects.countries).features;

    populationData.forEach(row => {
        var countries = geoData.filter(d => d.id ===
            row.countryCode);
        countries.forEach(country => country.properties = row);
    });

    var width = 960;
    var height = 600;

    var projection = d3.geoMercator()
                        .scale(125)
                        .translate([width/2, g=height/1.4]);

    var path = d3.geoPath().projection(projection);

    d3.select("svg")
        .attr("width", width)
        .attr("height", height)
        .selectAll(".country")
        .data(geoData)
        .enter()
            .append("path")
            .classed("country", true)
            .attr("d", path);
    });

