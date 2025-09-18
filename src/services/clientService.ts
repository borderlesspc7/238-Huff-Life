import { db } from "../lib/firebaseconfig";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import type { UpdateData } from "firebase/firestore";
import type { Client, ClientPurchase } from "../types/client";

export const clientService = {
  // Criar cliente
  async createClient(
    clientData: Omit<Client, "id" | "createdAt" | "updatedAt">
  ): Promise<Client> {
    try {
      const now = new Date();
      const clientToSave = {
        ...clientData,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
        totalPurchases: 0,
      };

      const docRef = await addDoc(collection(db, "clients"), clientToSave);
      return {
        id: docRef.id,
        ...clientData,
        createdAt: now,
        updatedAt: now,
        totalPurchases: 0,
      };
    } catch (error) {
      throw new Error("Erro ao criar cliente: " + error);
    }
  },

  // Buscar todos os clientes
  async getAllClients(): Promise<Client[]> {
    try {
      const clientRef = collection(db, "clients");
      const querySnapshot = await getDocs(clientRef);
      const clients = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          notes: data.notes,
          createdAt: data.createdAt.toDate() || new Date(),
          updatedAt: data.updatedAt.toDate() || new Date(),
          lastPurchase: data.lastPurchase?.toDate() || null,
          totalPurchases: data.totalPurchases || 0,
          status: data.status || "active",
        } as Client;
      });
      return clients;
    } catch (error) {
      throw new Error("Erro ao buscar todos os clientes: " + error);
    }
  },

  // Atualizar cliente
  async updateClient(id: string, clientData: Partial<Client>): Promise<void> {
    try {
      const clientRef = doc(db, "clients", id);
      const docSnapshot = await getDoc(clientRef);
      if (!docSnapshot.exists()) {
        throw new Error("Cliente não encontrado");
      }

      // Preparar dados para atualização, convertendo Date para Timestamp
      const updateData: UpdateData<Client> = {
        ...clientData,
        updatedAt: Timestamp.fromDate(new Date()),
      };

      // Remover campos que não devem ser atualizados
      delete updateData.id;
      delete updateData.createdAt;
      delete updateData.totalPurchases; // Não deve ser atualizado diretamente

      // Converter lastPurchase se existir
      if (updateData.lastPurchase instanceof Date) {
        updateData.lastPurchase = Timestamp.fromDate(updateData.lastPurchase);
      }

      await updateDoc(clientRef, updateData);
    } catch (error) {
      throw new Error("Erro ao atualizar cliente: " + error);
    }
  },

  // Deletar cliente
  async deleteClient(id: string): Promise<void> {
    try {
      const clientRef = doc(db, "clients", id);
      const docSnapshot = await getDoc(clientRef);
      if (!docSnapshot.exists()) {
        throw new Error("Cliente não encontrado");
      }
      await deleteDoc(clientRef);
    } catch (error) {
      throw new Error("Erro ao deletar cliente: " + error);
    }
  },

  // Adicionar compra ao cliente
  async addPurchase(
    clientId: string,
    purchase: Omit<ClientPurchase, "id" | "clientId">
  ): Promise<void> {
    try {
      const purchaseRef = collection(db, "clients_purchases");
      const purchaseData = {
        ...purchase,
        clientId,
        date: Timestamp.fromDate(new Date()),
      };
      await addDoc(purchaseRef, purchaseData);

      const clientRef = doc(db, "clients", clientId);
      const clientSnapshot = await getDoc(clientRef);

      if (!clientSnapshot.exists()) {
        throw new Error("Cliente não encontrado");
      }

      const clientData = clientSnapshot.data();
      const newTotal = (clientData.totalPurchases || 0) + purchase.value;

      await updateDoc(clientRef, {
        totalPurchases: newTotal,
        lastPurchase: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      throw new Error("Erro ao adicionar compra ao cliente: " + error);
    }
  },

  // Buscar histórico de compras do cliente
  async getClientPurchases(clientId: string): Promise<ClientPurchase[]> {
    try {
      const purchaseRef = collection(db, "clients_purchases");
      const q = query(
        purchaseRef,
        where("clientId", "==", clientId),
        orderBy("date", "desc")
      );

      const querySnapshot = await getDocs(q);
      const purchases = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          clientId: data.clientId,
          date: data.date.toDate() || new Date(),
          value: data.value,
          products: data.products,
          status: data.status,
        } as ClientPurchase;
      });
      return purchases;
    } catch (error) {
      throw new Error(
        "Erro ao buscar histórico de compras do cliente: " + error
      );
    }
  },
};
