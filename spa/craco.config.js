module.exports = {
    webpack: {
        alias: {
            '@mui/styled-engine': '@mui/styled-engine-sc'
        }
    },
    jest: {
        configure: {
            verbose: true,
            moduleNameMapper: {
                '@mui/styled-engine': '@mui/styled-engine-sc'
            }
        }
    }
}
