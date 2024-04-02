import React from 'react'

const ReturnParams = (hash) => {
    const stringAfterHashing = hash.substring(1)
    const ParamsInUrl = stringAfterHashing.split("&");
    const paramsSplitUp = ParamsInUrl.reduce((accu, currentValue) => {
        // console.log('currentvalue', currentValue)
        const [key, value] = currentValue.split("=")
        accu[key] = value;
        return accu
    }, {})
    return paramsSplitUp;
}

export default ReturnParams
