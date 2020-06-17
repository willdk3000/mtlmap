import React from 'react'

const MonthlyTable = ({ monthVariation, typeMonthVariation }) => {

    return (
        <div className="col-12 text-center" style={{ paddingTop: "10px" }}>
            <h6><b>Dernier mois</b></h6>
            <h6>Variation du prix moyen</h6>
            {//<h6>Tout type confondu : {monthVariation.length ? monthVariation : 'Aucune donnée'}</h6>
            }
            <table className="table table-sm">
                <tbody>
                    {typeMonthVariation.length ? typeMonthVariation.map((e) => {
                        return (
                            <tr key={e.type}>
                                <td className="text-left">{e.type}</td>
                                <td className="text-right">{e.meanPriceVar} ({e.meanPriceVarPct})</td>
                            </tr>
                        )
                    }) : 'Aucune donnée'}
                </tbody>
            </table>
        </div>
    )
}

export default MonthlyTable

