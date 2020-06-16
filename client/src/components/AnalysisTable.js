import React from 'react'
import { averagePrice } from '../helpers/averagePrice'

const AnalysisTable = ({ nomSecteur, avgPrice, typeMonthVariation }) => {

    return (
        <div className="text-center">
            <h6>{nomSecteur}</h6>
            <h6>Prix moyen</h6>
            <h6>Tout type confondu : {avgPrice.length ? (Math.round(avgPrice / 1000) * 1000).toLocaleString() + '$' : "Aucune donnée"} </h6>
            <div>
                {typeMonthVariation.map((e) => {
                    return (
                        <div key={e.type}>{e.type} : {e.meanPrice.toLocaleString() + '$'}</div>
                    )
                })}
            </div>
        </div>
    )
}

export default AnalysisTable

