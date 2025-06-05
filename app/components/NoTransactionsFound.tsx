import { styles } from '@/assets/styles/home.styles'
import { COLORS } from '@/constants/colors'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { View, Text, TouchableOpacity } from 'react-native'

export const NoTransactionsFound = () => {
  const router = useRouter();
  return (
    <View style={styles.emptyState}>
      <Ionicons
        name='receipt-outline'
        size={60}
        color={COLORS.textLight}
        style={styles.emptyStateIcon}
      />
      <Text style={styles.emptyStateTitle}> Aun no hay transactiones </Text>
      <Text style={styles.emptyStateText}>
        Comience a realizar un seguimiento de sus finanzas agregando sus primeras transaciones
      </Text>

      <TouchableOpacity style={styles.emptyStateButton} onPress={() => router.push("/create")}>
        <Ionicons name='add-circle' size={18} color={COLORS.white} />
        <Text style={styles.emptyStateButtonText}>Nueva Transaction</Text>
      </TouchableOpacity>
    </View>
  )
}

