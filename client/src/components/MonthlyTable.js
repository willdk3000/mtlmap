import React from 'react'

const MonthlyTable = ({ monthVariation, typeMonthVariation }) => {

    return (
        <div className="text-center" style={{ paddingTop: "10px" }}>
            <h6><b>Dernier mois</b></h6>
            <h6>Variation du prix moyen</h6>
            <h6>Tout type confondu : {monthVariation.length ? monthVariation : 'Aucune donnée'}</h6>
            <div>
                {typeMonthVariation.length ? typeMonthVariation.map((e) => {
                    return (
                        <div key={e.type}>{e.type} : {e.meanPriceVar} {e.meanPriceVarPct}</div>
                    )
                }) : 'Aucune donnée'}
            </div>
        </div>
    )
}

export default MonthlyTable

