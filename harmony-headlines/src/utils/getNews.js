const url = `http://api.mediastack.com/v1/news`;

export function getNews() {
    const params = {
        languages: 'en',
        countries: 'us,il,ae',
        access_key: API_KEY,
        keywords: "israel,palestine",
        limit: 10
    };
    const urlParams = new URLSearchParams(params).toString();
    return fetch(`${url}?${urlParams}`)
        .then(res => res.json())
        .then(res => {
            return res;
        });
}