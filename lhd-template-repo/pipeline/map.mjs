import fs from 'fs';
import { geoMercator, geoPath, geoArea } from 'd3-geo';
import { feature } from 'topojson-client';
const topo = JSON.parse(fs.readFileSync('../node_modules/world-atlas/countries-50m.json'));
const au = feature(topo, topo.objects.countries).features.find(f => f.properties.name === 'Australia');
// keep polygons with meaningful area (mainland + Tasmania + a few large islands)
const polys = au.geometry.coordinates.filter(p => geoArea({type:'Polygon', coordinates:p}) > 1.5e-5);
const geo = { type:'Feature', geometry:{ type:'MultiPolygon', coordinates: polys } };
const W=880, H=760;
const proj = geoMercator().fitExtent([[10,10],[W-10,H-10]], geo);
const path = geoPath(proj).digits(1);
const d = path(geo);
const cities = { sydney:[151.209,-33.868], melbourne:[144.963,-37.814], brisbane:[153.026,-27.470], perth:[115.861,-31.952], adelaide:[138.600,-34.929], canberra:[149.130,-35.281], newcastle:[151.776,-32.928], hobart:[147.327,-42.882] };
const pts = Object.fromEntries(Object.entries(cities).map(([k,v])=>[k, proj(v).map(n=>+n.toFixed(1))]));
fs.writeFileSync('map.json', JSON.stringify({W,H,d,pts}));
console.log('polys', polys.length, 'path bytes', d.length, pts);
