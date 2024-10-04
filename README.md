# Memberspot Demo

This is a demo application for the Coding Challenge [FullStack] at Memberspot.  
The requirements can be found [here](https://github.com/memberspotde/coding-challenge-fs).

## Implementation Notes

### Backend

To enable pagination and global filtering across all fields in the SWAPI (Star Wars API), I implemented the following solution:

1. **Load Required Data**: 
   - Retrieve data for all people, including `name`, `birth_year`, `planet.name`, and `planet.terrain`. This involves making three requests to the SWAPI API:
     1.1 Fetch all people from the SWAPI.  
     1.2 Batch-fetch all person details in a single request.  
     1.3 Batch-fetch all planets in a single request.  
     1.4 Map all data into a single `Person` array object.

2. **In-Memory Caching**: 
   - Cache the data in memory for the lifetime of the server application, as there are only 82 records in total.

3. **API Request Optimization**: 
   - Use the cached data for subsequent API requests, allowing for pagination and filtering.

### Frontend

I am using the PrimeNG table component to display the data, where I can leverage the built-in lazy-loading feature.

## Alternative Approaches

If the SWAPI API ([swapi.tech](https://www.swapi.tech/)) were more efficient, you could make all requests, including pagination and filtering, directly against the REST API. However, because the data is nested so deeply, it makes sense to load all 82 records at once (which takes about 3-5 seconds) to provide a much smoother user experience without delays. The filtering using query parameters on SWAPI also does not work for birth_year and planet.terrain because they are nested more deeply.

Other implementations of SWAPI are more advanced and use technologies like GraphQL to query all information in a single request. I was especially confused by [swapi.dev](https://swapi.dev/) at the beginning and accidentally used it, where the information is not nested as deeply as it is on [swapi.tech](https://www.swapi.tech/).

For the frontend, I initially tried to implement virtual scrolling. However, it was difficult for me to detect when the user reached the end of the list while scrolling down, so I determined that, for this solution, pagination (with lazy loading) would make more sense.
