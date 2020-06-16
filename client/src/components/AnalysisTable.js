import React from 'react'

const AnalysisTable = ({ nomSecteur, avgPrice, typeMonthVariation }) => {

    return (
        <div className="text-center">
            <h6>{nomSecteur}</h6>
            <h6>Prix moyen : {avgPrice ? (Math.round(avgPrice / 1000) * 1000).toLocaleString() : ""}$ </h6>
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

