import { BiSearch } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import { useEffect, useState } from "react";

function App() {
  const [inputValue, setInputValue] = useState('');
  const [tarefas, setTarefas] = useState([]);
  const [dadosApresentados, setDadosApresentados] = useState(false);
  const [tarefasRealizadas, setTarefasRealizadas] = useState([]);

  const handleInput = (e) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    const storageTarefas = localStorage.getItem('@tarefas');
    const storageTarefasRealizadas = localStorage.getItem('@tarefasRealizadas');

    if (storageTarefas) {
      setTarefas(JSON.parse(storageTarefas));
    }

    if (storageTarefasRealizadas) {
      setTarefasRealizadas(JSON.parse(storageTarefasRealizadas));
    }

    setDadosApresentados(true);
  }, []);

  useEffect(() => {
    if (dadosApresentados) {
      localStorage.setItem('@tarefas', JSON.stringify(tarefas));
    }
  }, [tarefas, dadosApresentados]);

  const inputLength = inputValue.length;

  const handleRegister = (e) => {
    e.preventDefault();
    setTarefas([...tarefas, { id: Date.now(), text: inputValue }]);
    setInputValue('');
  };

  const handleCheckBox = (tarefa) => {
    // Mover a tarefa da lista de tarefas pendentes para a lista de tarefas realizadas
    const tarefaIndex = tarefas.findIndex((item) => item.id === tarefa.id);
    const tarefaRemovida = tarefas.splice(tarefaIndex, 1)[0]; // o 1 é a quantidade de elementos a serem removidos a partir do índice especificado
                                                              //Ao adicionarmos [0] após o splice(tarefaIndex, 1), estamos acessando o primeiro elemento desse novo array
                                                              // a const tarefaRemovida está armazenando o elemento removido do array tarefas na variável tarefaRemovida.
    setTarefas([...tarefas]);
    setTarefasRealizadas([...tarefasRealizadas, tarefaRemovida]);
  };

  const handleDelete = (tarefa) => {
    // Remover a tarefa da lista de tarefas pendentes ou da lista de tarefas realizadas
    const tarefaIndex = tarefas.findIndex((item) => item.id === tarefa.id);
    if (tarefaIndex !== -1) { // -1 siginifica que nenhuma tarefa foi encontrada, porque se index = -1, não existe
      tarefas.splice(tarefaIndex, 1); // quantidade de elementos a serem removidos a partir do índice especificado
      setTarefas([...tarefas]);
    } else {
      const tarefaRealizadaIndex = tarefasRealizadas.findIndex((item) => item.id === tarefa.id);
      tarefasRealizadas.splice(tarefaRealizadaIndex, 1);
      setTarefasRealizadas([...tarefasRealizadas]);
    }
  };

  useEffect(() => {
    const removedStorage = localStorage.getItem('@tarefasRealizadas');
    if (removedStorage) {
      setTarefasRealizadas(JSON.parse(removedStorage));
      setDadosApresentados(true);
    }
  }, []);

  useEffect(() => {
    if (dadosApresentados) {
      localStorage.setItem('@tarefasRealizadas', JSON.stringify(tarefasRealizadas));
    }
  }, [tarefasRealizadas, dadosApresentados]);

  return (
    <div className="bg-[#7CBEF2] w-[100vw] h-[100vh] flex items-center justify-center px-20">
      <div className="flex flex-col gap-8 bg-white w-[600px] px-8 py-8 rounded-xl text-lg">
        <span className="flex flex-row items-center justify-between">
          <h1 className="font-bold text-blue-600">Criador de Tarefas</h1>
          <BiSearch className="text-2xl" />
        </span>

        <div className="text-black flex flex-col gap-3">
          <h1 className="font-bold text-2xl">Pendentes</h1>
          {tarefas.map((t) => (
            <div key={t.id} className="flex flex-row items-center justify-between">
              <span className="pl-5">
                <input
                  type="checkbox"
                  id={`checkbox-${t.id}`}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  checked={false}
                  onChange={() => handleCheckBox(t)}
                />
                <label htmlFor={`checkbox-${t.id}`} className="px-5">
                  {t.text}
                </label>
              </span>
              <AiOutlineClose className="cursor-pointer" onClick={() => handleDelete(t)} />
            </div>
          ))}
        </div>

        <div className="text-black flex flex-col gap-3">
          <h1 className="font-bold text-2xl">Realizadas</h1>
          {tarefasRealizadas.map((t) => (
            <div key={t.id} className="flex flex-row items-center justify-between">
              <span className="pl-5">
                <input
                  type="checkbox"
                  id={`checkbox-${t.id}`}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  checked
                  onChange={() => handleCheckBox(t)}
                />
                <label htmlFor={`checkbox-${t.id}`} className="px-5 line-through text-slate-500">
                  {t.text}
                </label>
              </span>
              <AiOutlineClose className="cursor-pointer" onClick={() => handleDelete(t)} />
            </div>
          ))}
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-6">
          <span>
            <input
              required
              maxLength={30}
              type="text"
              placeholder="O que você gostaria de fazer?"
              className="text-lg w-full px-4 py-2 outline-none border-4 border-gray-300 rounded-xl"
              value={inputValue}
              onChange={handleInput}
            />
            <p className="text-xs text-gray-500">Carácteres máx. {inputLength}/30</p>
          </span>

          <button className="bg-[#67BF76] hover:bg-[#48ab59] transition-colors duration-200 text-white py-4 rounded-xl">
            Adicione uma tarefa
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
