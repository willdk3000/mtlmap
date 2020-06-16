import React from 'react'

const MonthlyTable = ({ monthVariation, typeMonthVariation }) => {

    return (
        <div className="text-center" style={{ paddingTop: "10px" }}>
            <h6><b>Dernier mois</b></h6>
            <h6>Variation du prix moyen:</h6>
            <h6>Tout type confondu : {monthVariation}</h6>
            <div>
                {typeMonthVariation.map((e) => {
                    return (
                        <div key={e.type}>{e.type} : {e.meanPriceVar} {e.meanPriceVarPct}</div>
                    )
                })}
            </div>
        </div>
    )
}

export default MonthlyTable

