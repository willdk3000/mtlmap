import React, { Component } from 'react';
import MapGL from 'react-map-gl';
import ReactLoading from 'react-loading';

import HighlightsTable from './HighlightsTable'
import AnalysisTable from './AnalysisTable'

import { getSecteurs, uniqueListings, avgPrice } from '../API/API'

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
      isFeatureLoading: 0,
      hoveredSecteur: { "type": "FeatureCollection", "features": [] },
      isHovered: 0
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

      // let emptyGeoJSON = { "type": "FeatureCollection", "features": [] }

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
            'fill-color': '#000000',
            'fill-outline-color': '#000000',
            'fill-opacity': 0.6
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

    const hoveredFeature = features && features.find(f => f.layer.id === 'secteurs-sm');

    if (hoveredFeature !== undefined) {


      this.setState({
        hoveredSecteur: hoveredFeature,
        isHovered: 1
        //x: offsetX,
        //y: offsetY
      });
    } else {
      this.setState({
        hoveredSecteur: { "type": "FeatureCollection", "features": [] },
        isHovered: 0
        //x: offsetX,
        //y: offsetY
      })
    }

  };


  componentDidUpdate = async (prevProps, prevState) => {

    const { hoveredSecteur, isHovered } = this.state;
    const { mapIsLoaded } = this.state;

    if (!mapIsLoaded) {
      return;
    }

    // Gestion highlight

    if (hoveredSecteur !== prevState.hoveredSecteur && hoveredSecteur !== undefined && isHovered == 1) {
      this.map.getSource("secteurHighlight").setData(hoveredSecteur);

      // On hover - only very short requests

    }

    if (this.state.isHovered == 0) {

    }


  }



  _onClick = async (event) => {

    this.setState({
      isFeatureLoading: 1
    })

    const { mapIsLoaded } = this.state;

    const { features, srcEvent: { offsetX, offsetY } } = event;
    const clickedFeature = features && features.find(f => f.layer.id === 'secteurs-sm');

    // For bigger analysis, use on click because of delay
    const nbListings = await uniqueListings(clickedFeature.properties.id);
    const price = await avgPrice(clickedFeature.properties.id);

    this.setState({
      clickedFeature,
      nbListings,
      price,
      isFeatureLoading: 0,
      x: offsetX,
      y: offsetY,
    });

  };


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

  analysisTable() {
    if (this.state.isFeatureLoading == 1) {
      return (
        <ReactLoading type={"spinningBubbles"} color={"#8856a7"} height={250} width={125} />
      )
    } else if (this.state.clickedFeature) {
      return (
        <AnalysisTable
          nomSecteur={this.state.clickedFeature.properties.nom}
          nbListings={this.state.nbListings.length}
          avgPrice={this.state.price[0].avg} />
      )
    }
  }



  render() {
    const { viewport, hoveredSecteur, isHovered, nbListings, price } = this.state;

    return <div className="container-fluid">
      <div className="row">
        <div className="col-2">
          <div className="row justify-content-center">
            <HighlightsTable
              nomSecteur={isHovered == 1 ? hoveredSecteur.properties.nom : ""}
            />
          </div>
          <div className="row justify-content-center" style={{ marginTop: "50%" }}>
            {this.analysisTable()}
          </div>
        </div>
        <div className="col-sm-10">
          <MapGL
            {...viewport}
            ref={(reactMap) => this.reactMap = reactMap}
            width="100%"
            height="100vh"
            mapStyle="mapbox://styles/wdoucetk/cjun8whio1ha21fmzxt8knp7k"
            onViewportChange={this._onViewportChange}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_KEY}
            onHover={this._onHover}
            onClick={this._onClick}
          >
            {//this._renderTooltip()
            }
          </MapGL>
        </div>
      </div>
    </div >

  }
}

export default Map;

//mapbox://styles/wdoucetk/cjun8whio1ha21fmzxt8knp7k light
//mapbox://styles/wdoucetk/cjuc6i3960ggz1flfzzn3upav navigation