from flask import Flask, jsonify
from flask_cors import CORS
import json
import os
import matplotlib.pyplot as plt
import io
import base64

app = Flask(__name__)
CORS(app)  # Adiciona o suporte a CORS

# Carregar dados do estoque do arquivo JSON com codificação UTF-8
def carregar_dados_estoque():

    
    with open(os.path.join("data", "dados_estoque.json"), "r", encoding="utf-8") as file:
        return json.load(file)

# Função para gerar um gráfico de barras
def gerar_grafico_barras(x, y, titulo, xlabel, ylabel):
    plt.bar(x, y, color="#372660")  # Define a cor personalizada
    plt.title(titulo)
    plt.xlabel(xlabel)
    plt.ylabel(ylabel)
    plt.xticks(rotation=45)
    plt.tight_layout()

    # Salvar o gráfico em um buffer de memória
    img_buf = io.BytesIO()
    plt.savefig(img_buf, format='png')
    img_buf.seek(0)
    img_base64 = base64.b64encode(img_buf.getvalue()).decode('utf-8')
    plt.close()  # Fechar o gráfico para evitar sobrecarga de memória
    return img_base64

# Rota para obter os insights e gráficos
@app.route('/api/insights', methods=['GET'])
def obter_insights():
    dados_estoque = carregar_dados_estoque()

    # Calcular os insights
    total_estoque = sum(produto['quantidade'] * produto['preco'] for produto in dados_estoque)
    quantidade_total = sum(produto['quantidade'] for produto in dados_estoque)
    quantidade_por_categoria = {}
    valor_por_categoria = {}

    for produto in dados_estoque:
        categoria = produto['categoria']
        if categoria not in quantidade_por_categoria:
            quantidade_por_categoria[categoria] = 0
            valor_por_categoria[categoria] = 0
        quantidade_por_categoria[categoria] += produto['quantidade']
        valor_por_categoria[categoria] += produto['quantidade'] * produto['preco']

    insights = {
        "total_estoque": total_estoque,
        "quantidade_total": quantidade_total,
        "quantidade_por_categoria": quantidade_por_categoria,
        "valor_por_categoria": valor_por_categoria,
    }

    # Gerar gráficos
    categorias_quantidade = list(quantidade_por_categoria.keys())
    valores_quantidade = list(quantidade_por_categoria.values())
    categorias_valor = list(valor_por_categoria.keys())
    valores_valor = list(valor_por_categoria.values())

    # Gerar gráficos de barras
    grafico_quantidade = gerar_grafico_barras(categorias_quantidade, valores_quantidade, 
                                              'Quantidade por Categoria', 'Categoria', 'Quantidade')
    grafico_valor = gerar_grafico_barras(categorias_valor, valores_valor, 
                                         'Valor por Categoria', 'Categoria', 'Valor')

    # Adicionar gráficos ao retorno de insights
    insights['grafico_quantidade'] = grafico_quantidade
    insights['grafico_valor'] = grafico_valor

    return jsonify(insights)




if __name__ == '__main__':
    app.run(debug=True)




