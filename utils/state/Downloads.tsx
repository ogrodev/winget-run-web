import React, { createContext, useReducer } from "react";
import { IPackage } from "../../api/getPackages";
import { DownloadStateKey, stateOrStored, syncLocalStorage } from "../localStorage";

interface IDownload {
  Package: IPackage;
  Version: string;
}

interface IDownloadContext {
  packages: IDownload[];
  addPackage: (item: IPackage) => void;
  removePackage: (item: IPackage) => void;
  changePackageVersion: (item: IDownload) => void;
  clearPackages: () => void;
}

const Downloads: React.Context<IDownloadContext> = createContext(null);
const initialDownloadState = (localStorage.getItem(DownloadStateKey) || []) as IDownload[];

//TODO: abstract into seperate file
function downloadsReducer(state: IDownload[], action) {
  let newState: IDownload[] = stateOrStored(DownloadStateKey, state);
  switch (action.type) {
    case "add":
      newState = [
        ...newState,
        { Package: action.payload, Version: action.payload.Versions[0] },
      ];
      break;
    case "remove":
      newState = newState.filter((e) => e.Package.Id !== action.payload.Id);
      break;
    case "version":
      const stateClone: IDownload[] = JSON.parse(JSON.stringify(newState));

      const verIndex = stateClone.findIndex(
        (e) => e.Package.Id === action.payload.Package.Id
      );
      stateClone[verIndex].Version = action.payload.Version;

      newState = stateClone;
      break;
    case "clear":
      localStorage.clear()
      return [];
    default:
      throw new Error();
  }
  syncLocalStorage(DownloadStateKey, newState);
  return newState;
}

const DownloadsWrapper = ({ children }) => {
  const [state, dispatch] = useReducer(downloadsReducer, initialDownloadState);

  const addPackage = (item: IPackage) => {
    dispatch({ type: "add", payload: item });
  };
  const removePackage = (item: IPackage) => {
    dispatch({ type: "remove", payload: item });
  };

  const changePackageVersion = (item: IDownload) => {
    dispatch({ type: "version", payload: item });
  };

  const clearPackages = () => {
    dispatch({ type: "clear" });
  };

  return (
    <Downloads.Provider
      value={{
        packages: state,
        addPackage,
        removePackage,
        changePackageVersion,
        clearPackages,
      }}
    >
      {children}
    </Downloads.Provider>
  );
};

export { Downloads, DownloadsWrapper };
export type { IDownload };
