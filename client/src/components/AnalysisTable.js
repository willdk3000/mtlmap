import React from 'react'

const AnalysisTable = ({ nomSecteur, nbListings, avgPrice }) => {

    return (
        <div className="text-center">
            <h6>{nomSecteur}</h6>
            <h6>{nbListings} propriétés</h6>
            <h6>Prix moyen : {avgPrice ? avgPrice.toLocaleString() : ""}$ </h6>
        </div>
    )
}

export default AnalysisTable

