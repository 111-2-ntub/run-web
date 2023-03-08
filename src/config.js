const master = {
    // 正式機URL，勿動
    // API_URL: "https://test1022ntubimd.herokuapp.com/"
    API_URL: "http://localhost:5000/"
}

const dev = {
    API_URL: "https://test1022ntubimd.herokuapp.com/"
    // API_URL: "http://localhost:5000/"
}

export const config = process.env.NODE_ENV === "development" ? dev : master;