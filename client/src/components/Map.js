import React, { Component } from 'react';
import MapGL from 'react-map-gl';

import { getSecteurs } from '../API/API'

class Map extends Component {

  state = {
    viewport: {
      latitude: 45.556827,
      longitude: -73.662362,
      zoom: 10
    }
  };

  componentDidMount = async () => {

    //1 - Get Required Data
    const secteurs = await getSecteurs();

    //2 - Put Data in State
    this.setState({
      secteurs,
      hoveredSecteur: { "type": "FeatureCollection", "features": [] }
    })

    const map = this.reactMap.getMap();

    //Initialize map
    this.handleOnLoad(map)

  }


  componentWillUnmount = async () => {
    this.map.remove();
  }


  handleOnLoad = async (map) => {

    const { secteurs, hoveredSecteur } = this.state;

    map.on('load', () => {

      //let emptyGeoJSON = { "type": "FeatureCollection", "features": [] }

      // ADD SOURCES
      map.addSource(
        "secteurs", {
        "type": "geojson",
        "data": secteurs
      }
      );

      map.addSource(
        "secteurHighlight", {
        "type": "geojson",
        "data": hoveredSecteur
      }
      )

      // ADD LAYERS
      map.addLayer(
        {
          "id": "secteurs-sm",
          "type": "fill",
          "source": "secteurs",
          'paint': {
            'fill-color': '#8856a7',
            'fill-outline-color': '#000000',
            'fill-opacity': 0.5
          }
        }
      );

      map.addLayer(
        {
          "id": "secteurs-sm-highlight",
          "type": "fill",
          "source": "secteurHighlight",
          'paint': {
            'fill-color': '#fec44f',
            'fill-outline-color': '#000000',
            'fill-opacity': 0.5
          }
        }
      );

      map.addLayer(
        {
          "id": "secteurs-sm-highlight-line",
          "type": "line",
          "source": "secteurHighlight",
          'paint': {
            'line-width': 3,
            'line-color': '#000000'
          }
        }
      );

      this.setState({ mapIsLoaded: true });

    })

    this.map = map;

  }


  _onViewportChange = viewport => this.setState({ viewport });


  _onHover = event => {

    const { features, srcEvent: { offsetX, offsetY } } = event;

    const hoveredSecteur = features && features.find(f => f.layer.id === 'secteurs-sm');

    this.setState({
      hoveredSecteur,
      x: offsetX,
      y: offsetY
    });

  };


  componentDidUpdate = async (prevProps, prevState) => {

    const { hoveredSecteur } = this.state;
    const { mapIsLoaded } = this.state;

    if (!mapIsLoaded) {
      return;
    }

    // Gestion highlight
    if (hoveredSecteur !== prevState.hoveredSecteur && hoveredSecteur !== undefined) {
      this.map.getSource("secteurHighlight").setData(hoveredSecteur);

      // const vehRoutesSTM = this.state.vehiclesSTM ? this.state.vehiclesSTM.features.map((e) => {
      //   return e.properties.route_id
      // }) : ''

    }

  }

  // stopRequestSTM = async (trip) => {
  //   const stopsResponseSTM = await getStopsSTM(trip);
  //   const parseStopsSTM = stopsResponseSTM.rows[0].jsonb_build_object
  //   return parseStopsSTM
  // }

  // stopRequestRTL = async (trip) => {
  //   const stopsResponseRTL = await getStopsRTL(trip);
  //   const parseStopsRTL = stopsResponseRTL.rows[0].jsonb_build_object
  //   return parseStopsRTL
  // }

  // stopRequestSTL = async (trace) => {
  //   const stopsResponseSTL = await getStopsSTL(trace);
  //   const parseStopsSTL = stopsResponseSTL.rows[0].jsonb_build_object
  //   return parseStopsSTL
  // }


  // _onClick = async (event) => {

  //   const { mapIsLoaded } = this.state;

  //   let emptyGeoJSON = { "type": "FeatureCollection", "features": [] }

  //   const { features, srcEvent: { offsetX, offsetY } } = event;
  //   const clickedFeatureSTM = features && features.find(f => f.layer.id === 'position-vehicules-stm');
  //   const clickedFeatureSTL = features && features.find(f => f.layer.id === 'position-vehicules-stl');
  //   const clickedFeatureRTL = features && features.find(f => f.layer.id === 'position-vehicules-rtl');


  //   // Identification du trip (stm, rtl) ou de la ligne (stl) cliqué
  //   const tripClickSTM = clickedFeatureSTM ? clickedFeatureSTM.properties.trip_id : '';
  //   const routeClickSTL = clickedFeatureSTL ? clickedFeatureSTL.properties.route_id : '';
  //   const tripClickRTL = clickedFeatureRTL ? clickedFeatureRTL.properties.trip_id : '';


  //   // Détermination du shape à faire apparaître en fonction du trip ou de la ligne cliqué.
  //   const traceSTM = this.state.tracesSTM ? this.state.tracesSTM.features.filter((e) => {
  //     return e.properties.trips.some((f) => {
  //       return f === tripClickSTM
  //     })
  //   }) : ''

  //   const traceSTL = this.state.tracesSTL ? this.state.tracesSTL.features.filter((e) => {
  //     return e.properties.route_short_name === routeClickSTL
  //   }) : ''

  //   const traceRTL = this.state.tracesRTL ? this.state.tracesRTL.features.filter((e) => {
  //     return e.properties.trips.some((f) => {
  //       return f === tripClickRTL
  //     })
  //   }) : ''


  //   // Affichage de la trace
  //   const clickTraceSTM = mapIsLoaded === true ? (tripClickSTM !== '' ? this.map.getSource("tracesSTM").setData(traceSTM[0])
  //     : this.map.getSource("tracesSTM").setData(emptyGeoJSON))
  //     : '';

  //   const clickTraceSTL = mapIsLoaded === true ? (routeClickSTL !== '' ? this.map.getSource("tracesSTL").setData(traceSTL[0])
  //     : this.map.getSource("tracesSTL").setData(emptyGeoJSON))
  //     : '';

  //   const clickTraceRTL = mapIsLoaded === true ? (tripClickRTL !== '' ? this.map.getSource("tracesRTL").setData(traceRTL[0])
  //     : this.map.getSource("tracesRTL").setData(emptyGeoJSON))
  //     : '';


  //   //Requete pour obtenir les arrets a afficher selon le trip (ou la route)
  //   const stopsSTM = tripClickSTM !== '' ? await this.stopRequestSTM(tripClickSTM) : '';
  //   this.setState({ stopsSTM: stopsSTM })


  //   const clickStopsSTM = mapIsLoaded === true ? (this.state.stopsSTM !== '' ? this.map.getSource("stopsSTM").setData(this.state.stopsSTM)
  //     : this.map.getSource("stopsSTM").setData(emptyGeoJSON))
  //     : '';

  //   const stopsRTL = tripClickRTL !== '' ? await this.stopRequestRTL(tripClickRTL) : '';
  //   this.setState({ stopsRTL: stopsRTL })


  //   const clickStopsRTL = mapIsLoaded === true ? (this.state.stopsRTL !== '' ? this.map.getSource("stopsRTL").setData(this.state.stopsRTL)
  //     : this.map.getSource("stopsRTL").setData(emptyGeoJSON))
  //     : '';

  //   const stopsSTL = routeClickSTL !== '' ? await this.stopRequestSTL(traceSTL[0].properties.ID) : '';
  //   this.setState({ stopsSTL: stopsSTL })


  //   const clickStopsSTL = mapIsLoaded === true ? (this.state.stopsSTL !== '' ? this.map.getSource("stopsSTL").setData(this.state.stopsSTL)
  //     : this.map.getSource("stopsSTL").setData(emptyGeoJSON))
  //     : '';


  //   this.setState({
  //     clickedFeatureSTM,
  //     clickedFeatureSTL,
  //     clickedFeatureRTL,
  //     x: offsetX,
  //     y: offsetY,
  //   });

  // };


  // _renderTooltip() {

  //   const {
  //     hoveredFeatureSTM,
  //     hoveredStopSTM,
  //     hoveredFeatureSTL,
  //     hoveredFeatureRTL,
  //     hoveredFeatureCITLA,
  //     hoveredFeatureCITVR,
  //     x, y, mapIsLoaded } = this.state;



  //   // Identification du trip (stm, rtl) ou de la ligne (stl) hovered
  //   const tripHoverSTM = hoveredFeatureSTM ? hoveredFeatureSTM.properties.trip_id : '';
  //   const routeHoverSTL = hoveredFeatureSTL ? hoveredFeatureSTL.properties.route_id : '';
  //   const tripHoverRTL = hoveredFeatureRTL ? hoveredFeatureRTL.properties.trip_id : '';
  //   const tripHoverCITLA = hoveredFeatureCITLA ? hoveredFeatureCITLA.properties.trip_id : '';
  //   const tripHoverCITVR = hoveredFeatureCITVR ? hoveredFeatureCITVR.properties.trip_id : '';


  //   //Affectation du nom du trip ou de la ligne à une variable 
  //   const nomLigneSTM = this.state.tracesSTM ? this.state.tracesSTM.features.filter((e) => {
  //     return e.properties.trips.some((f) => {
  //       return f === tripHoverSTM
  //     })
  //   }) : ''

  //   const nomLigneSTL = this.state.tracesSTL ? this.state.tracesSTL.features.filter((e) => {
  //     return e.properties === routeHoverSTL
  //   }) : ''

  //   const nomLigneRTL = this.state.tracesRTL ? this.state.tracesRTL.features.filter((e) => {
  //     return e.properties.trips.some((f) => {
  //       return f === tripHoverRTL
  //     })
  //   }) : ''

  //   const nomLigneCITLA = this.state.tracesCITLA ? this.state.tracesCITLA.features.filter((e) => {
  //     return e.properties.trips.some((f) => {
  //       return f === tripHoverCITLA
  //     })
  //   }) : ''

  //   const nomLigneCITVR = this.state.tracesCITVR ? this.state.tracesCITVR.features.filter((e) => {
  //     return e.properties.trips.some((f) => {
  //       return f === tripHoverCITVR
  //     })
  //   }) : ''



  //   //AFFICHAGE DES TOOLTIP ON HOVER

  //   return hoveredFeatureSTM ?
  //     hoveredFeatureSTM && (
  //       //ne pas appeler la class 'tooltip' car il semble que ce nom soit en conflit
  //       //avec un autre tooltip...
  //       <div className="mapToolTip" style={{ left: x, top: y }}>
  //         <div>Véhicule: {hoveredFeatureSTM.properties.vehicle_id}</div>
  //         <div>Ligne: {hoveredFeatureSTM.properties.route_id}</div>
  //         {/*<div>Axe: {nomLigneSTM[0].properties.route_name ? nomLigneSTM[0].properties.route_name : ''}</div>*/}
  //         <div>Trip ID: {hoveredFeatureSTM.properties.trip_id}</div>
  //         <div>Mise à jour: {hoveredFeatureSTM.properties.timestamp ? hoveredFeatureSTM.properties.timestamp : ''} s</div>
  //       </div>
  //     ) :
  //     hoveredFeatureSTL ?
  //       hoveredFeatureSTL && (
  //         <div className="mapToolTip" style={{ left: x, top: y }}>
  //           <div>Véhicule: {hoveredFeatureSTL.properties.vehicle_id}</div>
  //           <div>Ligne: {hoveredFeatureSTL.properties.route_id}</div>
  //           <div>Mise à jour: {hoveredFeatureSTL.properties.last_connection} s</div>
  //         </div>
  //       ) :
  //       hoveredFeatureRTL ?
  //         hoveredFeatureRTL && (
  //           <div className="mapToolTip" style={{ left: x, top: y }}>
  //             <div>Véhicule: {hoveredFeatureRTL.properties.vehicle_id}</div>
  //             <div>Ligne: {hoveredFeatureRTL.properties.route_id}</div>
  //             {/*<div>Axe: {nomLigneRTL ? nomLigneRTL[0].properties.route_name : ''}</div>*/}
  //             <div>Trip ID: {hoveredFeatureRTL.properties.trip_id}</div>
  //             <div>Mise à jour: {hoveredFeatureRTL.properties.timestamp ? hoveredFeatureRTL.properties.timestamp : ''} s</div>
  //           </div>
  //         ) :
  //         hoveredFeatureCITLA ?
  //           hoveredFeatureCITLA && (
  //             <div className="mapToolTip" style={{ left: x, top: y }}>
  //               <div>Véhicule: {hoveredFeatureCITLA.properties.vehicle_id}</div>
  //               <div>Ligne: {hoveredFeatureCITLA.properties.route_id}</div>
  //               {/*<div>Axe: {nomLigneRTL ? nomLigneRTL[0].properties.route_name : ''}</div>*/}
  //               <div>Trip ID: {hoveredFeatureCITLA.properties.trip_id}</div>
  //               <div>Mise à jour: {hoveredFeatureCITLA.properties.timestamp ? hoveredFeatureCITLA.properties.timestamp : ''} s</div>
  //             </div>
  //           ) :
  //           hoveredFeatureCITVR ?
  //             hoveredFeatureCITVR && (
  //               <div className="mapToolTip" style={{ left: x, top: y }}>
  //                 <div>Véhicule: {hoveredFeatureCITVR.properties.vehicle_id}</div>
  //                 <div>Ligne: {hoveredFeatureCITVR.properties.route_id}</div>
  //                 {/*<div>Axe: {nomLigneRTL ? nomLigneRTL[0].properties.route_name : ''}</div>*/}
  //                 <div>Trip ID: {hoveredFeatureCITVR.properties.trip_id}</div>
  //                 <div>Mise à jour: {hoveredFeatureCITVR.properties.timestamp ? hoveredFeatureCITVR.properties.timestamp : ''} s</div>
  //               </div>
  //             ) : ''

  // }


  render() {

    const { viewport } = this.state;

    return <div className="container-fluid">

      <MapGL
        {...viewport}
        ref={(reactMap) => this.reactMap = reactMap}
        width="100%"
        height="100vh"
        mapStyle="mapbox://styles/wdoucetk/cjun8whio1ha21fmzxt8knp7k"
        onViewportChange={this._onViewportChange}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_KEY}
        onHover={this._onHover}
      //onClick={this._onClick}
      >
        {//this._renderTooltip()
        }
      </MapGL>
    </div>

  }
}

export default Map;

//mapbox://styles/wdoucetk/cjun8whio1ha21fmzxt8knp7k light
//mapbox://styles/wdoucetk/cjuc6i3960ggz1flfzzn3upav navigation