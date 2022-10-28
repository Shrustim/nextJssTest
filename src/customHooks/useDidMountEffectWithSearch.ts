import React, { useEffect, useRef } from 'react';

const useDidMountEffectWithSearch = (func:any, deps:any) => {
    const didMount = useRef(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (didMount.current) func();
            else didMount.current = true;
          
          }, 1000)
      
          return () => clearTimeout(delayDebounceFn)
        // if (didMount.current) func();
        // else didMount.current = true;
    }, deps);
}

export default useDidMountEffectWithSearch;