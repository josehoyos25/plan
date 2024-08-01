import React, { useState, useEffect } from "react";
import axiosCliente from "../axioCliente.js";
import styled from "styled-components";
import Modal from "react-modal";

const SEDE_OPTIONS = [
  { value: "centro", label: "Centro" },
  { value: "Yamboro", label: "Yamboró" },
];

// Estilos
const Container = styled.div`
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
  background: #f0f8ff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2.5em;
  margin-bottom: 20px;
  color: #4682b4;
  text-align: center;
  font-family: 'Arial', sans-serif;
`;

const AmbienteForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
`;

const AmbienteInput = styled.input`
  flex: 1;
  padding: 12px;
  font-size: 1em;
  border: 1px solid #b0c4de;
  border-radius: 8px;
  outline: none;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  background: #fff;
  color: #333;

  &:focus {
    border-color: #4682b4;
    box-shadow: 0 0 0 2px rgba(70, 130, 180, 0.25);
  }
`;

const AmbienteSelect = styled.select`
  flex: 1;
  padding: 12px;
  font-size: 1em;
  border: 1px solid #b0c4de;
  border-radius: 8px;
  outline: none;
  background: #fff;
  color: #333;

  &:focus {
    border-color: #4682b4;
    box-shadow: 0 0 0 2px rgba(70, 130, 180, 0.25);
  }
`;

const AmbienteButton = styled.button`
  padding: 12px 24px;
  font-size: 1em;
  color: #fff;
  background-color: ${(props) => (props.delete ? "#ff4d4d" : "#4682b4")};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${(props) => (props.delete ? "#e60000" : "#4169e1")};
  }

  &:active {
    background-color: ${(props) => (props.delete ? "#cc0000" : "#3742fa")};
  }
`;

const EstadoButton = styled.button`
  padding: 8px 16px;
  font-size: 1em;
  color: #fff;
  background-color: ${(props) => (props.activo ? "#4caf50" : "#f44336")}; // Verde para activo, rojo para inactivo
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${(props) => (props.activo ? "#388e3c" : "#d32f2f")}; // Colores más oscuros para el hover
  }

  &:active {
    background-color: ${(props) => (props.activo ? "#2e7d32" : "#c62828")}; // Colores más oscuros para el active
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const TableHeader = styled.th`
  padding: 12px;
  background: #4682b4;
  color: #fff;
  text-align: left;
  border-bottom: 2px solid #4169e1;
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #b0c4de;
  color: #333;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #e6f0ff;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const SelectedTitle = styled.h2`
  font-size: 1.8em;
  margin-top: 20px;
  margin-bottom: 10px;
  color: #4682b4;
  font-family: 'Arial', sans-serif;
`;

Modal.setAppElement("#root");

export function AmbienteTemplate() {
  const [ambientes, setAmbientes] = useState([]);
  const [newAmbiente, setNewAmbiente] = useState({
    nombre_amb: "",
    municipio: "",
    sede: "",
    estado: "activo"
  });
  const [token] = useState(""); 
  const [municipios, setMunicipios] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAmbiente, setCurrentAmbiente] = useState(null);
  const [updateAmbiente, setUpdateAmbiente] = useState({
    nombre_amb: "",
    municipio: "",
    sede: "",
    estado: "activo"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ambientesResponse = await axiosCliente.get("http://localhost:3000/api/ambientes", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAmbientes(ambientesResponse.data.datos);

        const municipiosResponse = await axiosCliente.get("http://localhost:3000/api/municipios", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMunicipios(municipiosResponse.data.datos);

      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, [token]);

  const handleCreateAmbiente = async (event) => {
    event.preventDefault();
    if (newAmbiente.nombre_amb.trim() === "") {
      return;
    }
    try {
      const response = await axiosCliente.post(
        "http://localhost:3000/api/ambientes",
        newAmbiente,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAmbientes([...ambientes, response.data.datos]);
      setNewAmbiente({
        nombre_amb: "",
        municipio: "",
        sede: "",
        estado: "activo"
      });
    } catch (error) {
      console.error("Error al crear ambiente:", error);
    }
  };

  const handleUpdateAmbiente = async () => {
    if (updateAmbiente.nombre_amb.trim() === "") {
      return;
    }
    try {
      const response = await axiosCliente.put(
        `http://localhost:3000/api/ambientes/${currentAmbiente.id_ambiente}`,
        updateAmbiente,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAmbientes(
        ambientes.map((ambiente) =>
          ambiente.id_ambiente === currentAmbiente.id_ambiente ? response.data : ambiente
        )
      );
      setIsModalOpen(false);
      setCurrentAmbiente(null);
      setUpdateAmbiente({
        nombre_amb: "",
        municipio: "",
        sede: "",
        estado: "activo"
      });
    } catch (error) {
      console.error("Error al actualizar ambiente:", error);
    }
  };

  const handleDeleteAmbiente = async (id) => {
    try {
      await axiosCliente.delete(`http://localhost:3000/api/ambientes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAmbientes(ambientes.filter((ambiente) => ambiente.id_ambiente !== id));
    } catch (error) {
      console.error("Error al eliminar ambiente:", error);
      alert("Se produjo un error al eliminar el ambiente. Por favor, intente nuevamente.");
    }
  };

  const handleToggleEstado = async (id_ambiente, currentEstado) => {
    const newEstado = currentEstado === "activo" ? "inactivo" : "activo";
    try {
      await axiosCliente.put(
        `http://localhost:3000/api/ambientes/${id_ambiente}`,
        { estado: newEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAmbientes(
        ambientes.map((ambiente) =>
          ambiente.id_ambiente === id_ambiente ? { ...ambiente, estado: newEstado } : ambiente
        )
      );
    } catch (error) {
      console.error("Error al cambiar estado del ambiente:", error);
    }
  };

  const openModal = (ambiente) => {
    setCurrentAmbiente(ambiente);
    setUpdateAmbiente({
      nombre_amb: ambiente.nombre_amb,
      municipio: ambiente.municipio,
      sede: ambiente.sede,
      estado: ambiente.estado
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentAmbiente(null);
    setUpdateAmbiente({
      nombre_amb: "",
      municipio: "",
      sede: "",
      estado: "activo"
    });
  };

  return (
    <Container>
      <Title>Gestión de Ambientes</Title>
      <AmbienteForm onSubmit={handleCreateAmbiente}>
        <AmbienteInput
          type="text"
          placeholder="Nombre del Ambiente"
          value={newAmbiente.nombre_amb}
          onChange={(e) => setNewAmbiente({ ...newAmbiente, nombre_amb: e.target.value })}
        />
        <AmbienteSelect
          value={newAmbiente.municipio}
          onChange={(e) => setNewAmbiente({ ...newAmbiente, municipio: e.target.value })}
        >
          <option value="">Seleccionar Municipio</option>
          {municipios.map((municipio) => (
            <option key={municipio.id_municipio} value={municipio.id_municipio}>
              {municipio.nombre_mpio}
            </option>
          ))}
        </AmbienteSelect>
        <AmbienteSelect
          value={newAmbiente.sede}
          onChange={(e) => setNewAmbiente({ ...newAmbiente, sede: e.target.value })}
        >
          <option value="">Seleccionar Sede</option>
          {SEDE_OPTIONS.map((sede) => (
            <option key={sede.value} value={sede.value}>
              {sede.label}
            </option>
          ))}
        </AmbienteSelect>
        <AmbienteButton type="submit">Añadir Ambiente</AmbienteButton>
      </AmbienteForm>
      <Table>
        <thead>
          <tr>
            <TableHeader>Nombre</TableHeader>
            <TableHeader>Municipio</TableHeader>
            <TableHeader>Sede</TableHeader>
            <TableHeader>Estado</TableHeader>
            <TableHeader>Acciones</TableHeader>
          </tr>
        </thead>
        <tbody>
          {ambientes.map((ambiente) => (
            <TableRow key={ambiente.id_ambiente}>
              <TableCell>{ambiente.nombre_amb}</TableCell>
              <TableCell>{ambiente.Municipio.nombre_mpio}</TableCell>
              <TableCell>{ambiente.sede}</TableCell>
              <TableCell>
                <EstadoButton
                  activo={ambiente.estado === "activo"}
                  onClick={() => handleToggleEstado(ambiente.id_ambiente, ambiente.estado)}
                >
                  {ambiente.estado === "activo" ? "Activo" : "Inactivo"}
                </EstadoButton>
              </TableCell>
              <TableCell>
                <ButtonGroup>
                  <AmbienteButton onClick={() => openModal(ambiente)}>Editar</AmbienteButton>
                  <AmbienteButton delete onClick={() => handleDeleteAmbiente(ambiente.id_ambiente)}>
                    Eliminar
                  </AmbienteButton>
                </ButtonGroup>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
      <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
        <Container>
          <Title>Actualizar Ambiente</Title>
          <AmbienteForm
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateAmbiente();
            }}
          >
            <AmbienteInput
              type="text"
              placeholder="Nombre del Ambiente"
              value={updateAmbiente.nombre_amb}
              onChange={(e) => setUpdateAmbiente({ ...updateAmbiente, nombre_amb: e.target.value })}
            />
            <AmbienteSelect
              value={updateAmbiente.municipio}
              onChange={(e) => setUpdateAmbiente({ ...updateAmbiente, municipio: e.target.value })}
            >
              <option value="">Seleccionar Municipio</option>
              {municipios.map((municipio) => (
                <option key={municipio.id_municipio} value={municipio.id_municipio}>
                  {municipio.nombre_mpio}
                </option>
              ))}
            </AmbienteSelect>
            <AmbienteSelect
              value={updateAmbiente.sede}
              onChange={(e) => setUpdateAmbiente({ ...updateAmbiente, sede: e.target.value })}
            >
              <option value="">Seleccionar Sede</option>
              {SEDE_OPTIONS.map((sede) => (
                <option key={sede.value} value={sede.value}>
                  {sede.label}
                </option>
              ))}
            </AmbienteSelect>
            <ButtonGroup>
              <AmbienteButton type="submit">Actualizar</AmbienteButton>
              <AmbienteButton delete onClick={closeModal}>
                Cancelar
              </AmbienteButton>
            </ButtonGroup>
          </AmbienteForm>
        </Container>
      </Modal>
    </Container>
  );
}