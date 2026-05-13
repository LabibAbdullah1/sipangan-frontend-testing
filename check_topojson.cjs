
const fs = require('fs');
const topojson = require('topojson-client');

try {
    const data = JSON.parse(fs.readFileSync('e:/Capstone Project/sipangan-frontend-testing/topojson/jawatimur.json', 'utf8'));
    console.log('Type:', data.type);
    console.log('Objects:', Object.keys(data.objects));
    
    const objectKey = Object.keys(data.objects)[0];
    const geojson = topojson.feature(data, data.objects[objectKey]);
    
    console.log('GeoJSON Type:', geojson.type);
    console.log('Features count:', geojson.features.length);
    
    // Calculate bounds
    let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
    
    function processCoords(coords) {
        if (typeof coords[0] === 'number') {
            const [lng, lat] = coords;
            if (lat < minLat) minLat = lat;
            if (lat > maxLat) maxLat = lat;
            if (lng < minLng) minLng = lng;
            if (lng > maxLng) maxLng = lng;
        } else {
            coords.forEach(processCoords);
        }
    }
    
    geojson.features.forEach(f => {
        processCoords(f.geometry.coordinates);
    });
    
    console.log('Bounds:');
    console.log('Min Lat:', minLat);
    console.log('Max Lat:', maxLat);
    console.log('Min Lng:', minLng);
    console.log('Max Lng:', maxLng);
    console.log('Center:', [(minLat + maxLat) / 2, (minLng + maxLng) / 2]);

} catch (err) {
    console.error('Error:', err);
}
