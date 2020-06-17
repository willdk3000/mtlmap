import React from 'react'

const AnalysisTable = ({ nomSecteur, avgPrice, typeMonthVariation }) => {

    return (
        <div className="col-12 text-center">
            <h6>{nomSecteur}</h6>
            <h6>Prix moyen</h6>
            {//<h6>Tout type confondu : {avgPrice === 'Aucune donnée' ? avgPrice : (Math.round(avgPrice / 1000) * 1000).toLocaleString() + '$'} </h6>
            }
            <table className="table table-sm">
                <tbody>
                    {typeMonthVariation.map((e) => {
                        return (
                            <tr key={e.type}>
                                <td className="text-left">{e.type}</td>
                                <td className="text-right">{e.meanPrice.toLocaleString() + '$'}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default AnalysisTable

