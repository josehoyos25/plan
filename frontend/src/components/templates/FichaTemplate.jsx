import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";

export function FichaTemplate() {
  const [fichasData, setFichasData] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [newFicha, setNewFicha] = useState({
    codigo: "",
    inicio_fecha: "",
    fin_lectiva: "",
    fin_ficha: "",
    programa: "",
    sede: "",
    estado: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fichasRes = await axios.get("/api/fichas");
        if (fichasRes.data.datos) {
          setFichasData(fichasRes.data.datos);
        } else {
          throw new Error("La respuesta de fichas no es válida");
        }

        // Obtener la lista de programas
        const programasRes = await axios.get("/api/programas");
        if (programasRes.data.datos) {
          setProgramas(programasRes.data.datos);
        } else {
          throw new Error("La respuesta de programas no es válida");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/fichas", newFicha);
      setFichasData([...fichasData, res.data]);
      setNewFicha({
        codigo: "",
        inicio_fecha: "",
        fin_lectiva: "",
        fin_ficha: "",
        programa: "",
        sede: "",
        estado: "",
      });
      setSuccess("Ficha creada con éxito.");
    } catch (error) {
      console.error(error);
      setError("Error al crear la ficha.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/fichas/${id}`);
      setFichasData(fichasData.filter((ficha) => ficha.codigo !== id));
      setSuccess("Ficha eliminada con éxito.");
    } catch (error) {
      console.error(error);
      setError("Error al eliminar la ficha.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFicha({ ...newFicha, [name]: value });
  };

  return (
    <Container>
      <Header>
        <Title>Gestión de Fichas</Title>
      </Header>
      <Form onSubmit={handleCreate}>
        <FormGroup>
          <Input
            type="number"
            name="codigo"
            value={newFicha.codigo}
            onChange={handleChange}
            placeholder="Código"
            required
          />
          <Input
            type="date"
            name="inicio_fecha"
            value={newFicha.inicio_fecha}
            onChange={handleChange}
            required
          />
          <Input
            type="date"
            name="fin_lectiva"
            value={newFicha.fin_lectiva}
            onChange={handleChange}
            required
          />
          <Input
            type="date"
            name="fin_ficha"
            value={newFicha.fin_ficha}
            onChange={handleChange}
            required
          />
          <Select
            name="programa"
            value={newFicha.programa}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar Programa</option>
            {programas.map((programa) => (
              <option key={programa.id_programa} value={programa.id_programa}>
                {programa.nombre_programa}
              </option>
            ))}
          </Select>
          <Input
            type="text"
            name="sede"
            value={newFicha.sede}
            onChange={handleChange}
            placeholder="Sede"
            required
          />
          <Input
            type="text"
            name="estado"
            value={newFicha.estado}
            onChange={handleChange}
            placeholder="Estado"
            required
          />
        </FormGroup>
        <Button type="submit">Crear Ficha</Button>
        {success && <Message success>{success}</Message>}
        {error && <Message>{error}</Message>}
      </Form>
      {loading ? (
        <Loading>Loading...</Loading>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Inicio</th>
              <th>Fin Lectiva</th>
              <th>Fin Ficha</th>
              <th>Programa</th>
              <th>Sede</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {fichasData.map((ficha) => (
              <tr key={ficha.codigo}>
                <td>{ficha.codigo}</td>
                <td>{new Date(ficha.inicio_fecha).toLocaleDateString()}</td>
                <td>{new Date(ficha.fin_lectiva).toLocaleDateString()}</td>
                <td>{new Date(ficha.fin_ficha).toLocaleDateString()}</td>
                <td>{programas.find((p) => p.id_programa === ficha.programa)?.nombre_programa}</td>
                <td>{ficha.sede}</td>
                <td>{ficha.estado}</td>
                <td>
                  <ActionButton onClick={() => handleDelete(ficha.codigo)}>
                    Eliminar
                  </ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

// Estilos usando styled-components

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 30px;
  background-color: ${(props) => props.theme.background};
  color: ${({ theme }) => theme.text};
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${(props) => props.theme.primary};
  font-weight: bold;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  background: ${(props) => props.theme.formBackground};
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 15px;
`;

const Input = styled.input`
  margin: 5px 0;
  padding: 10px;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 5px;
  width: calc(100% - 22px);
  box-sizing: border-box;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: ${(props) => props.theme.primary};
    outline: none;
  }
`;

const Select = styled.select`
  margin: 5px 0;
  padding: 10px;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 5px;
  width: calc(100% - 22px);
  box-sizing: border-box;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: ${(props) => props.theme.primary};
    outline: none;
  }
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.primary};
  color: ${(props) => props.theme.text};
  border: none;
  padding: 12px 24px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.primaryDark};
    transform: scale(1.02);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.98);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const Table = styled.table`
  width: 100%;
  max-width: 1200px;
  border-collapse: collapse;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  thead {
    background-color: ${(props) => props.theme.headerBg};
    color: ${(props) => props.theme.headerText};
    font-weight: bold;
  }

  th,
  td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid ${(props) => props.theme.border};
  }

  tbody tr:nth-of-type(even) {
    background-color: ${(props) => props.theme.rowEven};
  }

  tbody tr:nth-of-type(odd) {
    background-color: ${(props) => props.theme.rowOdd};
  }

  tr:hover {
    background-color: ${(props) => props.theme.rowHover};
    transition: background-color 0.3s ease;
  }
`;

const ActionButton = styled.button`
  background-color: ${(props) => props.theme.actionBg};
  color: ${(props) => props.theme.text};
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.actionBgDark};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Loading = styled.div`
  font-size: 1.2rem;
  color: ${(props) => props.theme.text};
`;

const Message = styled.div`
  font-size: 1rem;
  color: ${(props) => (props.success ? "green" : "red")};
  margin: 10px 0;
  text-align: center;
  background-color: ${(props) => (props.success ? "#d4edda" : "#f8d7da")};
  border: 1px solid ${(props) => (props.success ? "#c3e6cb" : "#f5c6cb")};
  padding: 10px;
  border-radius: 5px;
`;
