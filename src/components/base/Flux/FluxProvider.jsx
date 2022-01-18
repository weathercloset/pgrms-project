import { createContext, useContext } from 'react';

const FluxContext = createContext();
export const useFlux = () => useContext(FluxContext);

const FluxProvider = ({ children, gutter = 0 }) => {
  return <FluxContext.Provider value={{ gutter }}>{children}</FluxContext.Provider>;
};

export default FluxProvider;
