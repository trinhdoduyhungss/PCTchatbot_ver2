module.exports = {
    KNN: function (input, K) {
        let fs = require('fs');
        let wordVecs = fs.readFileSync('output_Vec.json', 'utf8')
        wordVecs = JSON.parse(wordVecs);
        let data_KNN = fs.readFileSync('data_KNN.json', 'utf8')
        data_KNN = JSON.parse(data_KNN)
        let data_Vec = fs.readFileSync('data_Vec.json', 'utf8')
        data_Vec = JSON.parse(data_Vec)
        let tokenizer = vntk.wordTokenizer('model.bin');
        function mashup(matrix) {
            let result = matrix[0]
            for (let i = 1; i < matrix.length; i++) {
                for (let j in matrix[i]) {
                    result[j] += matrix[i][j]
                }
            }
            return result
        }
        function getVec(text) {
            text = text.split(' ');
            let data_vec = []
            for (let word in text) {
                if (wordVecs[text[word]] != undefined) {
                    data_vec.push(wordVecs[text[word]])
                }
            }
            return mashup(data_vec)
        }
        function L2_norm(a) {
            let value = 0
            for (let i in a) {
                value += a[i] * a[i]
            }
            if (value != 0) {
                let sqrt_value = Math.sqrt(value)
                return sqrt_value
            }
        }
        function cosine_similarity(a, b) {
            let value_dot = 0
            for (let i in a) {
                value_dot += a[i] * b[i]
            }
            if (value_dot != 0) {
                return value_dot / (L2_norm(a) * L2_norm(b))
            }
        }
        function sort(data) {
            return Object.keys(data)
                .sort((c, b) => {
                    return data[b] - data[c]
                })
                .reduce((acc, cur) => {
                    let o = []
                    o.push(cur, data[cur])
                    acc[acc.length] = o
                    return acc
                }, [])
        }
        function KNN(input, data_text, data_vec, K) {
            input = getVec(tokenizer.tag(input, 'text'))
            let results_sim = {}
            for (let i in data_text) {
                if (data_vec[i] != undefined) {
                    results_sim[i] = cosine_similarity(input, data_vec[i])
                }
            }
            if (Object.keys(results_sim).length > 0) {
                results_sim = sort(results_sim)
                    let return_sim = []
                for (let i in results_sim) {
                    if (return_sim.length < K) {
                        return_sim.push(results_sim[i])
                    } else {
                        break
                    }
                }
                if (return_sim.length > 0) {
                    let count = {}
                    for (let item in return_sim) {
                        if (count[data_text[return_sim[item][0]]] == null || count[data_text[return_sim[item][0]]] == undefined) {
                            count[data_text[return_sim[item][0]]] = 1
                        } else {
                            count[data_text[return_sim[item][0]]] += 1
                        }
                    }
                    if (Object.keys(count).length > 0) {
                        count = sort(count)
                        return count[0][0]
                    }
                }
            }
        }
        return KNN(input, data_KNN, data_Vec, K)
    }
}