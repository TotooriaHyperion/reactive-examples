import { districtData } from "./district";

const empty: string[] = [];

const random = () => Math.random() * 1500;

export function sleep(time: number) {
  return new Promise((rs) => {
    setTimeout(rs, time);
  });
}
export function getProvinces() {
  return sleep(random()).then(() => districtData.map((item) => item.name));
}

export function getCities(province: string) {
  return sleep(random()).then(
    () =>
      districtData
        .find((item) => item.name === province)
        ?.city?.map((item) => item.name) ?? empty,
  );
}
export function getAreas(province: string, cities: string) {
  return sleep(random()).then(
    () =>
      districtData
        .find((item) => item.name === province)
        ?.city.find((item) => item.name === cities)?.area ?? empty,
  );
}
