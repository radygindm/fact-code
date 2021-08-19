export default function () {
    const url = 'https://raw.githubusercontent.com/WilliamRu/TestAPI/master/db.json';
    return fetch(url).then(res => res.json());
}