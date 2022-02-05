
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { makeStyles } from '@mui/styles';

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';

import ReactMapGL, { 
  Source,
  Layer,
  Marker,
  NavigationControl,
  FlyToInterpolator
} from 'react-map-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from "mapbox-gl";

import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

import iconMarker from "../assets/images/home-icon.png";

import { 
  MAPBOX_TOKEN,
  google,
  HEATMAP_MAX_ZOOM_LEVEL,
  HEATMAP_STYLE,
  CATEGORIES
} from "../settings.js";

import { getFeatures, addFeature } from "../services.js";

mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const useStyles = makeStyles({
    mapContainer:{
        position:'relative',
        width:'100vw',
        height:'100vh',
       '& .mapboxgl-ctrl-logo': {
          display: 'none'
        }
    },
    searchBox:{
        position:'absolute',
        top:10,
        right:10,
        width: 400,
        zIndex:100
    }
 });

function Main() {
  const classes = useStyles();
  const mapRef = useRef(null);
  const [viewport, setViewport] = useState({
    longitude: 173.1657001,
    latitude: -41.4408959,
    zoom: 5
  });
  const [mapCursor, setMapCursor] = useState('default');
  const [searchPlace, setSearchPlace] = useState(null);
  const [features, setFeatures] = useState([]);
  const [addPlaceDialogOpen, setAddPlaceDialogOpen] = useState(false);
  const [interactiveLayerIds, setInteractiveLayerIds] = useState([]);
  const [drawStatus, setDrawStatus] = useState(false);

  const onMarkerDragEnd = (e) => {
    setSearchPlace({
        ...searchPlace,
        location:e.lngLat
    });
    const geocoder = new google.maps.Geocoder();
    var latlng = {lat: e.lngLat[1], lng: e.lngLat[0]};
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
            if (results[0]) {
                var place = results[0];
                if(place && place.geometry && place.formatted_address){
                    setSearchPlace({
                        ...searchPlace,
                        location: e.lngLat,
                        address:place.formatted_address
                    });
                }
            } else {
                console.log('No Geocoder results found');
            }
        } else {
            console.log('Geocoder failed due to: ' + status);
        }
    });
  };

  const handleViewportChange = useCallback((newViewport) => setViewport(newViewport), []);

  const onMapLoad = useCallback(evt => {
    
    fetchFeatures();
   
    setInteractiveLayerIds(['point-layer']);

  }, []);

  useEffect(() => {
    if(searchPlace){
      document.getElementById("input-address").value = searchPlace.address;
    }else{
      document.getElementById("input-address").value = '';
    }
  }, [searchPlace]);

  useEffect(() => {

    const map = mapRef.current.getMap();
    map.loadImage(iconMarker, (error, image) => {
        if (error) throw error;
        // Add the image to the map style.
        map.addImage('marker-icon', image);
    });

    var input = document.getElementById("input-address");
    const options = {
       componentRestrictions: { country:"nz"}
    }
    const autocomplete = new google.maps.places.Autocomplete(input, options);

    const placeChangeHandle = google.maps.event.addListener(autocomplete, "place_changed", function () {
        var place = autocomplete.getPlace();
        if(place && place.geometry && place.formatted_address){
          setSearchPlace({
            title:'',
            category:'',
            location:[
              place.geometry.location.lng(),
              place.geometry.location.lat()
            ],
            address:place.formatted_address,
            description:''
          });
          setViewport({
              ...viewport,
              longitude:place.geometry.location.lng(),
              latitude:place.geometry.location.lat(),
              zoom:18,
              bearing:0,
              transitionInterpolator: new FlyToInterpolator(),
              transitionDuration: 1000
          })
        }
    });

    return () => {
        if(map.hasImage('marker-icon')){
            map.removeImage('marker-icon');
        }
        google.maps.event.removeListener(placeChangeHandle);
    }

  }, []);

  const fetchFeatures = async () => {
    let res = await getFeatures();
    if(res.status === 'success'){
       setFeatures(res.result);
    }else{
       console.log(res.message);
    }
  }

  const handleDrawButtonClick = () => {
     setSearchPlace(null);
     //setMapCursor('crosshair');
     setMapCursor(`url(${iconMarker}) 16 44, auto`);
     setDrawStatus(true);
  }

  const onMapClick = (e) => {
    if(drawStatus){
        const geocoder = new google.maps.Geocoder();
        var latlng = {lat: e.lngLat[1], lng: e.lngLat[0]};
        geocoder.geocode({'location': latlng}, function(results, status) {
            if (status === 'OK') {
                if (results[0]) {
                        var place = results[0];
                        if(place && place.geometry && place.formatted_address){
                            setSearchPlace({
                                title:'',
                                category:'',
                                location:e.lngLat,
                                address:place.formatted_address,
                                description:''
                            });
                        }
                        setDrawStatus(false);
                        setMapCursor('default');
                } else {
                    console.log('No Geocoder results found');
                }
            } else {
              console.log('Geocoder failed due to: ' + status);
            }
        });
    }
  };

  const handleAddPlace = async () => {
    setAddPlaceDialogOpen(false);
    let res = await addFeature(searchPlace);
    if(res.status === 'success'){
        setFeatures([
          ...features,
          res.result
        ]);
        setSearchPlace(null);
    }else{
        console.log(res.message);
    }
 }

  return (
      <div className={classes.mapContainer}>
        <div className={classes.searchBox}>
            <TextField
                id="input-address"
                name="address"
                placeholder="Enter your address"
                fullWidth
                autoComplete="off"
                InputProps={{
                    startAdornment:(
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                    endAdornment:(
                        <InputAdornment position="end">
                            <IconButton
                                onClick={()=>setSearchPlace(null)}
                                onMouseDown={(e)=>e.preventDefault()}
                                edge="end"
                            >
                                {(searchPlace && searchPlace.address) && <CloseIcon />}
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />
        </div>

        <Tooltip title="Add Feature" placement="left">
            <IconButton 
                aria-label="add feature"
                style={{
                    position:'absolute',
                    top:80,
                    right:10,
                    backgroundColor:'white',
                    zIndex:100
                }}
                onClick={handleDrawButtonClick}
            >
                <AddLocationAltIcon color="warning" />
            </IconButton>
        </Tooltip>

        <ReactMapGL
              {...viewport}    
              width="100%"
              height="100%"
              mapStyle="mapbox://styles/mapbox/dark-v9"
              //mapStyle="mapbox://styles/mapbox/light-v10"
              //mapStyle="mapbox://styles/mapbox/streets-v11"
              //mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
              mapboxApiAccessToken={MAPBOX_TOKEN}
              ref = {mapRef}
              attributionControl={false}
              maxZoom={22}
              minZoom={5}
              interactiveLayerIds={interactiveLayerIds}
              onViewportChange={handleViewportChange}
              getCursor={()=>mapCursor}
              onLoad={onMapLoad}
              onClick={onMapClick}
          >
            <Source
                id="heatmapSource"
                type="geojson"
                data={{
                    type:'FeatureCollection',
                    features: features
                }}
            >
            <Layer 
                    id='heatmap-layer'
                    type='heatmap'
                    source='heatmapSource'
                    maxzoom={HEATMAP_MAX_ZOOM_LEVEL}
                    paint={HEATMAP_STYLE}
                />
                <Layer
                    id='point-layer'
                    type='circle'
                    source='heatmapSource'
                    minzoom={HEATMAP_MAX_ZOOM_LEVEL}
                    paint={{
                        'circle-color': '#a88f3d',
                        'circle-radius': 6,
                        'circle-stroke-width': 1,
                        'circle-stroke-color': '#ffffff'
                    }}
                />
            </Source>

            {searchPlace && (
                <Marker
                   longitude={searchPlace.location[0]}
                   latitude={searchPlace.location[1]}
                   offsetLeft={-16}
                   offsetTop={-44}
                   draggable={true}
                   onDragEnd={onMarkerDragEnd}
                   onClick={()=>setAddPlaceDialogOpen(true)}
                >
                   <img src={iconMarker} alt="search-marker" style={{cursor:'pointer'}}/>
                </Marker>
            )}
            <NavigationControl style={{ top:10, left:10}}/>
        </ReactMapGL>
        <Dialog
            open={addPlaceDialogOpen}
            onClose={()=>setAddPlaceDialogOpen(false)}
            aria-labelledby="dialog-add-place"
            aria-describedby="dialog-add-place"
        >
            <DialogTitle>
                Add New Place
                <IconButton
                    aria-label="close"
                    onClick={()=>setAddPlaceDialogOpen(false)}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                  <CloseIcon />
                </IconButton>
            </DialogTitle>
            <ValidatorForm
                onSubmit={handleAddPlace}
                style={{ width: "100%" }}
            >
                <DialogContent>
                    <Typography variant="caption" style={{marginLeft:20}}>
                        Title
                    </Typography>
                    <TextValidator 
                        name="title"
                        fullWidth
                        value={searchPlace?searchPlace.title:''}
                        onChange={(e)=>setSearchPlace({...searchPlace,title:e.target.value})}
                        validators={['required']}
                        errorMessages={['Title is required.']}
                        style={{marginBottom:10}}
                    />
                    <Typography variant="caption" style={{marginLeft:20}}>
                        Category
                    </Typography>
                    <TextField
                        variant="outlined"
                        //label="Select categories"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        select={true}
                        SelectProps={{
                            MenuProps: {
                                anchorOrigin: { vertical: "bottom", horizontal: "center" },
                                transformOrigin: { vertical: "top", horizontal: "center" },
                                getContentAnchorEl: null
                            }
                        }}
                        value={searchPlace?searchPlace.category:''}
                        onChange={(e) => setSearchPlace({
                            ...searchPlace,
                            category: e.target.value
                        })}
                        style={{marginBottom:10}}
                    >
                        {  
                            CATEGORIES.map((item,index)=>(
                                <MenuItem key={`category-${index}`} value={item}>
                                    {item}
                                </MenuItem>  
                            ))
                        }
                    </TextField>
                    <Typography variant="caption" style={{marginLeft:20}}>
                        Address
                    </Typography>
                    <TextField 
                        name="address"
                        fullWidth
                        disabled={true}
                        value={searchPlace?searchPlace.address:''}
                        style={{marginBottom:10}}
                    />
                    <Typography variant="caption" style={{marginLeft:20}}>
                        Description
                    </Typography>
                    <TextValidator
                        name="description"
                        fullWidth
                        //multiline
                        //rows={4}
                        value={searchPlace?searchPlace.description:''}
                        onChange={(e)=>setSearchPlace({...searchPlace,description:e.target.value})}
                        validators={['required']}
                        errorMessages={['Description is required.']}
                    />
                </DialogContent>
                <DialogActions>
                    <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            fullWidth
                            onClick={()=>setAddPlaceDialogOpen(false)}
                        >Cancel</Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button 
                            type="submit"
                            variant="contained"
                            color="warning"
                            autoFocus
                            fullWidth
                        >Add</Button>
                    </Grid>
                    </Grid>
               </DialogActions>
            </ValidatorForm>  
        </Dialog>
      </div>
  );
}

export default Main;
