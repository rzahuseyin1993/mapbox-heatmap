//export const BASE_URL = 'http://localhost:3001';

export const BASE_URL = 'https://mapbox-heatmap.herokuapp.com';

export const MAPBOX_TOKEN = "pk.eyJ1IjoibGVld2FuZ2RldiIsImEiOiJja2tnbDU2c2gwMHNvMndsdDF1d2pxNTQ2In0.zKeo06DtCh6fLifrbCZCFA";

export const google = window.google;

export const HEATMAP_MAX_ZOOM_LEVEL = 12;

export const HEATMAP_STYLE = {
    'heatmap-weight':[
        'interpolate',['linear'], ['zoom'],
        5,
        0.2,
        HEATMAP_MAX_ZOOM_LEVEL,
        1
    ],
    'heatmap-intensity': [
        'interpolate',['linear'], ['zoom'],
        5,
        5,
        HEATMAP_MAX_ZOOM_LEVEL,
        1
    ],
    'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(33,102,172,0)',
        0.2,
        'rgb(103,169,207)',
        0.4,
        'rgb(209,229,240)',
        0.6,
        'rgb(253,219,199)',
        0.8,
        'rgb(239,138,98)',
        0.9,
        'rgb(255,201,101)'
    ],
    'heatmap-radius': [
        'interpolate',['linear'],['zoom'],
        5,
        10,
        HEATMAP_MAX_ZOOM_LEVEL,
        20
    ],
    'heatmap-opacity': [
        'interpolate',['linear'],['zoom'],
        5,
        1,
        HEATMAP_MAX_ZOOM_LEVEL,
        0.2
    ]
}

export const CATEGORIES = [
    'Category A',
    'Category B',
    'Category C',
    'Category D',
];