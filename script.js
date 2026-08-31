document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cep-form');
    const cepInput = document.getElementById('cep-input');
    const resultSection = document.getElementById('result-section');
    const errorMessage = document.getElementById('error-message');

    const fields = {
        logradouro: document.getElementById('logradouro'),
        bairro: document.getElementById('bairro'),
        localidade: document.getElementById('localidade')
    };

    cepInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 5) {
            value = value.replace(/^(\d{5})(\d)/, '$1-$2');
        }
        e.target.value = value;
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const cep = cepInput.value.replace(/\D/g, '');

        if (cep.length !== 8) {
            showError('Por favor, digite um CEP válido com 8 dígitos.');
            return;
        }

        const btn = document.getElementById('search-btn');
        btn.innerText = 'Buscando...';
        btn.disabled = true;

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            if (!response.ok) throw new Error('Falha na rede');

            const data = await response.json();

            if (data.erro) {
                showError('CEP não encontrado na base de dados.');
                hideResult();
            } else {
                showResult(data);
            }
        } catch (error) {
            showError('Ocorreu um erro ao buscar o endereço. Tente novamente.');
            hideResult();
        } finally {
            btn.innerText = 'Buscar';
            btn.disabled = false;
        }
    });

    function showResult(data) {
        errorMessage.classList.add('hidden');
        
        fields.logradouro.textContent = data.logradouro || 'Não informado (CEP Geral)';
        fields.bairro.textContent = data.bairro || 'Não informado';
        fields.localidade.textContent = `${data.localidade} / ${data.uf}`;
        
        const statusEntrega = document.getElementById('status-entrega');
        
        const cidadesAtendidas = [
            'recife',
            'olinda',
            'jaboatao dos guararapes',
            'jaboatão dos guararapes',
            'paulista',
            'abreu e lima',
            'igarassu',
            'camaragibe',
            'cabo de santo agostinho',
            'sao lourenco da mata',
            'são lourenço da mata',
            'ipojuca',
            'moreno',
            'aracoiapa',
            'araçoiapa',
            'itapissuma',
            'itamaraca',
            'itamaracá',
            'ilha de itamaraca',
            'ilha de itamaracá'
        ];

        const cidadeRetornada = (data.localidade || '').toLowerCase().trim();
        const ePernambuco = data.uf === 'PE';
        
        const atendeRegiao = ePernambuco && cidadesAtendidas.includes(cidadeRetornada);

        if (atendeRegiao) {
            statusEntrega.textContent = '✔️ Entrega Disponível (Região Metropolitana)';
            statusEntrega.className = 'badge available';
        } else {
            statusEntrega.textContent = '❌ Indisponível para esta região';
            statusEntrega.className = 'badge unavailable';
        }

        resultSection.classList.remove('hidden');
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    function hideResult() {
        resultSection.classList.add('hidden');
    }
});