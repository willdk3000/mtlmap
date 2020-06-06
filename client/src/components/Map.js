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
        isHovered: 1,
        x: offsetX,
        y: offsetY
      });

    } else {

      this.setState({
        hoveredSecteur: { "type": "FeatureCollection", "features": [] },
        isHovered: 0,
        x: offsetX,
        y: offsetY
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

    const { mapIsLoaded } = this.state;

    const { features, srcEvent: { offsetX, offsetY } } = event;
    const clickedFeature = features && features.find(f => f.layer.id === 'secteurs-sm');

    // For bigger analysis, use on click because of delay

    if (clickedFeature !== undefined) {

      this.setState({
        isFeatureLoading: 1
      })

      const nbListings = await uniqueListings(clickedFeature.properties.id);
      const price = await avgPrice(clickedFeature.properties.id);

      this.setState({
        clickedFeature,
        featureWasClicked: 1,
        nbListings,
        price,
        isFeatureLoading: 0,
        x: offsetX,
        y: offsetY,
      });
    }

  };


  _renderTooltip() {

    const {
      hoveredSecteur,
      isHovered,
      x, y, mapIsLoaded } = this.state;

    //   //AFFICHAGE DES TOOLTIP ON HOVER

    return hoveredSecteur && isHovered == 1 ?
      hoveredSecteur && (
        //ne pas appeler la class 'tooltip' car il semble que ce nom soit en conflit
        //avec un autre tooltip...
        <div className="mapToolTip" style={{ left: x, top: y }}>
          <div>{hoveredSecteur.properties.nom}</div>
        </div>
      ) : ''
  }

  analysisTable() {
    if (this.state.isFeatureLoading == 1) {
      return (
        <ReactLoading type={"spinningBubbles"} color={"#8856a7"} height={250} width={125} />
      )
    } else if (this.state.featureWasClicked == 1) {
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
        <div className="col-lg-2 col-sm-12">
          <div className="row justify-content-center">
            <HighlightsTable
              nomSecteur={isHovered == 1 ? hoveredSecteur.properties.nom : ""}
            />
          </div>
          <div className="row justify-content-center" style={{ marginTop: "30%" }}>
            {this.analysisTable()}
          </div>
        </div>
        <div className="col-lg-10 col-sm-12">
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
            {this._renderTooltip()}
          </MapGL>
        </div>
      </div>
    </div >

  }
}

export default Map;

//mapbox://styles/wdoucetk/cjun8whio1ha21fmzxt8knp7k light
//mapbox://styles/wdoucetk/cjuc6i3960ggz1flfzzn3upav navigation