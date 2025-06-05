// react custom hook file

import { API_URL } from "@/constants/api";
import { useCallback, useState } from "react"
import { Alert } from "react-native";

//const API_URL = 'http://localhost:5001/api';

export const useTransactions = (userId: string) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  // metodo get para traer transactions echas
  //Se memoiza con useCallback para evitar recreaciones innecesarias.
  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/${userId}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.log("Error al hacer el feching de transactions: ", error);
    }
  }, [userId]);

  // metodo get para traer el resumen de transactions sumando income, expenses y balance
  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error("Error al traer el resumen: ", error);
    }
  }, [userId]);

  // recargar datos
  const loadData = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      // ejecucion en paralelo
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.error("Error al cargar los datos: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  // metodo delete elimina las transactions q ya no queremos q se muestren
  const deleteTransactions = async (id: number) => {

    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(" Error al eliminar la transacion");

      // refrescamos los datos despues de eliminar
      loadData();
      Alert.alert("Success", "transacion eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar la transacion: ", error);

      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "Error desconocido");
      }
    }
  };

  return { transactions, summary, isLoading, loadData, deleteTransactions };
};
