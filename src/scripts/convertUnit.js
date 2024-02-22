function ConvertUnit(chem) {
  for (const prop in chem) {
    if (typeof chem[prop] === "object") {
      switch (prop) {
        case "V":
          switch (chem[prop].unit) {
            case 'cm^3':
              chem[prop].quantity /= 1000;
              chem[prop].unit = "dm^3";
              break;
            case 'm^3':
              chem[prop].quantity *= 1000;
              chem[prop].unit = "dm^3";
              break;
          }
          break;
        case "m":
          switch (chem[prop].unit) {
            case 'mg':
              chem[prop].quantity /= 1000;
              chem[prop].unit = "g";
              break;
            case 'dg':
              chem[prop].quantity /= 10;
              chem[prop].unit = "g";
              break;
            case 'dag':
              chem[prop].quantity *= 10;
              chem[prop].unit = "g";
              break;
            case 'kg':
              chem[prop].quantity *= 1000;
              chem[prop].unit = "g";
              break;
          }
          break;
        case "n":
          switch (chem[prop].unit) {
            case 'mmol':
              chem[prop].quantity /= 1000;
              chem[prop].unit = "mol";
              break;
          }
          break;
        case 'p':
        case 'p1':
        case 'p0':
          switch (chem[prop].unit) {
            case 'bar':
              chem[prop].quantity /= 100000;
              chem[prop].unit = "Pa";
              break;
            case 'kPa':
              chem[prop].quantity *= 1000;
              chem[prop].unit = "Pa";
              break;
          }
          break;
        case 'c0':
        case 'c1':
        case 'c':
          switch (chem[prop].unit) {
            case 'mmol/L':
              chem[prop].quantity /= 1000;
              chem[prop].unit = "mol/L";
              break;
          }
          break;
      }
    }
  }
}

export const convertUnit = ConvertUnit;