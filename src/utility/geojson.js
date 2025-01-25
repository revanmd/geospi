// utils/cacheGeoJSON.js

// Save a GeoJSON file into the Cache API
export const SaveGeoJSONToCache = async (category, regionalKey, geojson) => {
  const cacheName = `${category}-geojson-cache`; // Cache name based on category
  const cacheKey = `${category}-${regionalKey}`; // Unique key for category + region

  try {
    const cache = await caches.open(cacheName);

    // Convert GeoJSON to a Response object
    const response = new Response(JSON.stringify(geojson), {
      headers: { "Content-Type": "application/json" },
    });

    await cache.put(cacheKey, response);
    console.log(`Saved GeoJSON for ${cacheKey} into Cache API.`);
  } catch (error) {
    console.error("Error saving GeoJSON to Cache API:", error);
  }
};

// Retrieve a GeoJSON file from the Cache API
export const LoadGeoJSONFromCache = async (category, regionalKey) => {
  const cacheName = `${category}-geojson-cache`; // Cache name based on category
  const cacheKey = `${category}-${regionalKey}`; // Unique key for category + region

  try {
    const cache = await caches.open(cacheName);
    const response = await cache.match(cacheKey);

    if (response) {
      console.log(`Loaded GeoJSON for ${cacheKey} from Cache API.`);
      return response.json(); // Return parsed GeoJSON
    } else {
      console.warn(`GeoJSON for ${cacheKey} not found in Cache API.`);
      return null;
    }
  } catch (error) {
    console.error("Error loading GeoJSON from Cache API:", error);
    return null;
  }
};

// Delete a specific GeoJSON file from the Cache API
export const DeleteGeoJSONFromCache = async (category, regionalKey) => {
  const cacheName = `${category}-geojson-cache`;
  const cacheKey = `${category}-${regionalKey}`;

  try {
    const cache = await caches.open(cacheName);
    const success = await cache.delete(cacheKey);

    if (success) {
      console.log(`Deleted GeoJSON for ${cacheKey} from Cache API.`);
    } else {
      console.warn(`GeoJSON for ${cacheKey} not found in Cache API.`);
    }
  } catch (error) {
    console.error("Error deleting GeoJSON from Cache API:", error);
  }
};
