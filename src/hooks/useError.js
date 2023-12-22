import React, { useCallback } from 'react'
import useAlert from './useAlert'

/**
 * Usage:
 *
 * const showError = useError()
 * showError('something wrong')
 *
 * */

const useError = () => {
    const { error } = useAlert()

    return useCallback(errorMessage => {
        error(errorMessage)
    }, [])
}

export default useError
