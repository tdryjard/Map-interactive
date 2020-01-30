import React, { useState, useEffect } from 'react';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import './MakeRepere.css'

const MappingClient = () => {
    const [results, setResults] = useState({})
    const [pos, setPos] = useState([47.9027336, 1.9086066])
    const [posStart, setPosStart] = useState([47.9027336, 1.9086066])
    const [posEnd, setPosEnd] = useState([47.9027336, 1.9086066])
    const provider = new OpenStreetMapProvider();
    const [zooming, setZooming] = useState(6)
    const [inputValue, setInputValue] = useState("")
    const [validPosition, setValidPosition] = useState(1)
    const [adressEnter, setAdressEnter] = useState(0)

    const validPos = () => {
      setAdressEnter(adressEnter+1)
      setValidPosition(null)
      console.log(adressEnter)
    }

    const validEnter = () => {
      setValidPosition(2)
      setAdressEnter(null)
    }

    const takeAdress = async (event) => {
      event.preventDefault();
      setInputValue(event.currentTarget[0].value);
      const result = await giveMeCoords(inputValue);
      const resultFr = result.filter(res => (++res.y > 42.5 && ++res.y < 51) && (++res.x < 8 && ++res.x > -5))

      setResults(resultFr)
    }

    const onMapClick = async (e) => {
      let position = [e.latlng.lat, e.latlng.lng]
      setPos(position);
      if(validPosition === 1){
        setPosStart(position)
      }
      else if(validPosition === 2){
        setPosEnd(position)
      }
    }

    const putMarker = async (event) => {
      event.preventDefault();
      const adress = event.target.innerHTML;
      const result = await giveMeCoords(adress);
      const coords = [+result[0].y, +result[0].x]
      setPos([...coords]);
      setResults({})
      await setTimeout(function() {
        if(result[0].raw.type === "city"){
          setZooming(14)
        }
        else if (result[0].raw.type){
          setZooming(15)
        }
      }, 1500)
    }



    const giveMeCoords = async (adress) => {
      // console.log(adress)
      return await provider.search({ query: adress });
    }

    

    return (
      <div className="contentMap">
        <form className="searchAdress" onChange={takeAdress} style={{cursor: 'pointer'}}>
          <input className='takeAdress'/>
        </form>

        <div className="contentResult">

        {
          (results.length &&
            results.map(result =>
            <div className="contentAdress">
              <p className="resultAdress" onClick={putMarker}>{result.label}</p>
            </div>))
        }

        <p>{posStart}</p>
        <p>{posEnd}</p>

        </div>
        <LeafletMap className="contentMapping" onClick={onMapClick}
        center={pos}
        zoom={zooming}
        maxZoom={19}
        attributionControl={true}
        zoomControl={true}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        dragging={true}
        animate={true}
        easeLinearity={0.35}
      >
          
        <TileLayer
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
        {validPosition === 1 ?
        <Marker className="marker" position={posStart} style="width: 50px">
          <Popup>
            Demande de livraison 
            <a className="buttonAnnouncement"> voir annonce</a>
          </Popup>
        </Marker>
        : validPosition === 2 ?
        <div>
        <Marker className="marker" position={posStart} style="width: 50px">
          <Popup>
            Demande de livraison 
            <a className="buttonAnnouncement"> voir annonce</a>
          </Popup>
        </Marker>
        <Marker src={require("./image/markerEnd.png")} className="markerEnd" position={pos} style="width: 50px">
        <Popup>
          Demande de livraison 
          <a className="buttonAnnouncement"> voir annonce</a>
        </Popup>
      </Marker>
      </div>
      :
      null
      }

        
      
      
      </LeafletMap>
      {validPosition === 1 ?
      <div className="divEnterAdressMapClient">
      <p className="messageMap">Placez votre point de départ</p>
      <button className="validPos" onClick={validPos}>Valider point de départ</button>
      </div>
      : adressEnter === 1 ?
      <div className="divEnterAdressMapClient">
        <p className="messageMap">écrivez cette adresse</p>
        <input className="enterAdressMapClient" placeholder="entrer addresse de départ"/>
        <button className="validAdressMapClient" onClick={validEnter}>valider</button>
      </div>
      : validPosition === 2 ?
      <div className="divEnterAdressMapClient">
        <p className="messageMap">Placez votre point d'arrivé</p>
        <button className="validPos" onClick={validPos}>Valider point d'arrivé</button>
      </div>
      :
      <div>
        <p className="messageMap">écrivez cette adresse</p>
        <input className="enterAdressMapClient" placeholder="entrer addresse d'arrivé'"/>
        <button className="validAdressMapClient">valider</button>
      </div>
      }
      </div>
    )
}

export default MappingClient;