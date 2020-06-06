import React from 'react'

const AnalysisTable = ({ nomSecteur, nbListings }) => {

    return (
        <div className="text-center">
            <h6>{nomSecteur}</h6>
            <h6>{nbListings} propriétés</h6>
        </div>
    )
}

export default AnalysisTable

