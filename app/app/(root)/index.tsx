import { styles } from '@/assets/styles/home.styles'
import { BalanceCard } from '@/components/BalanceCard'
import { NoTransactionsFound } from '@/components/NoTransactionsFound'
import PageLoader from '@/components/PageLoader'
import { SignOutButton } from '@/components/SignOutButton'
import { TransactionItem } from '@/components/TransactionItem'
import { useTransactions } from '@/hooks/useTransactions'
import { useUser } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native'

export default function Page() {
  const { user } = useUser();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const { transactions, summary, isLoading, loadData, deleteTransactions } = useTransactions(user.id);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // efecto secundario para cargar los datos
  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = (id) => {
    Alert.alert("Delete transactions", "Esta seguro de que quiere liminar esta transacion?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => deleteTransactions(id) },
    ]);
  }

  if (isLoading && !refreshing) return <PageLoader />

  return (
    <View style={styles.container} >
      <View style={styles.content}>
        {/*HEADER*/}
        <View style={styles.header}>

          {/*IZQUIERDA*/}
          <View style={styles.headerLeft}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.headerLogo}
              resizeMode='contain'
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText} >Biembenido</Text>
              <Text style={styles.usernameText} >
                {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
              </Text>
            </View>
          </View>

          {/*DERECHA*/}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
              <Ionicons name='add' size={20} color="#FF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>

        {/*BALANCE*/}
        <BalanceCard summary={summary} />

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}> Transaciones Recientes</Text>
        </View>
      </View>

      {/*LISTA DE TRANSACIONES*/}
      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={({ item }) => <TransactionItem item={item} onDelete={handleDelete} />}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

    </View>
  );
}
