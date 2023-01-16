const fetchData = async (url) => {
    const data = await fetch(url);
    return data.json();
}

export { fetchData };