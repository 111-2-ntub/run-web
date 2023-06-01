const master = {
    // 正式機URL，勿動
    // API_URL: "https://test1022ntubimd.herokuapp.com/"
    API_URL: "http://localhost:8000/"
}

const dev = {
    // API_URL: "https://test1022ntubimd.herokuapp.com/"
    API_URL: "https://run-back.onrender.com/"
}

export const config = process.env.NODE_ENV === "development" ? dev : master;