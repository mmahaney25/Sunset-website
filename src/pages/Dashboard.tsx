import { Link } from 'react-router-dom'
import { AppShell } from '../components/Layout'
import PipelineTracker from '../components/PipelineTracker'
import { Money, SectionHeader, StatPill } from '../components/ui'
import { useStore } from '../store'

export default function Dashboard() {
  const { assets, liabilities, deceased, estateAccount, notifications, beneficiaries, loadDemoEstate } = useStore((s) => ({
    assets: s.assets, liabilities: s.liabilities, deceased: s.deceased,
    estateAccount: s.estateAccount, notifications: s.notifications,
    beneficiaries: s.beneficiaries, loadDemoEstate: s.loadDemoEstate,
  }))

  const totalAssets = assets.reduce((sum, a) => sum + a.balance, 0)
  const totalLiabs = liabilities.reduce((sum, l) => sum + l.balance, 0)
  const net = totalAssets - totalLiabs

  return (
    <AppShell>
      <SectionHeader
        title={deceased ? `Estate of ${deceased.fullName}` : 'Estate workspace'}
        subtitle={deceased ? `${deceased.county ? deceased.county + ' County, ' : ''}${deceased.state} · Date of death ${deceased.dod}` : 'Begin by running a discovery search.'}
        right={
          assets.length === 0 ? (
            <button onClick={loadDemoEstate} className="btn-secondary text-sm">Load demo estate</button>
          ) : null
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatPill label="Discovered assets" value={assets.length} />
        <StatPill label="Total asset value" value={<Money value={totalAssets} />} tone="good" />
        <StatPill label="Outstanding debts" value={liabilities.length} tone={liabilities.length ? 'warn' : 'default'} />
        <StatPill label="Net estate" value={<Money value={net} />} tone={net >= 0 ? 'good' : 'bad'} />
      </div>

      <PipelineTracker />

      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <Link to="/app/estate-account" className="card hover:border-sunset-400 transition">
          <div className="text-xs uppercase tracking-wider text-muted mb-1">Estate account</div>
          <div className="font-serif text-2xl"><Money value={estateAccount.balance} /></div>
          <div className="text-sm text-muted mt-2">
            {estateAccount.status === 'not_started' && 'Not started — open an account to begin consolidating funds.'}
            {estateAccount.status === 'ein_filed' && 'EIN filed with the IRS — ready to open the account.'}
            {estateAccount.status === 'opened' && `Account ••${estateAccount.accountNumber?.slice(-4)} · ${estateAccount.transactions.length} transactions`}
          </div>
        </Link>
        <Link to="/app/closures" className="card hover:border-sunset-400 transition">
          <div className="text-xs uppercase tracking-wider text-muted mb-1">Notifications sent</div>
          <div className="font-serif text-2xl">{notifications.length}</div>
          <div className="text-sm text-muted mt-2">
            {notifications.length === 0 ? 'No creditors notified yet.' : `${notifications.filter((n) => n.status === 'confirmed').length} confirmed, ${notifications.filter((n) => n.status === 'sent' || n.status === 'pending').length} awaiting response`}
          </div>
        </Link>
        <Link to="/app/distribution" className="card hover:border-sunset-400 transition">
          <div className="text-xs uppercase tracking-wider text-muted mb-1">Beneficiaries</div>
          <div className="font-serif text-2xl">{beneficiaries.length}</div>
          <div className="text-sm text-muted mt-2">
            {beneficiaries.length === 0 ? 'No heirs added — they\'ll be derived from will or intestacy.' : `${beneficiaries.filter((b) => b.approvalState !== 'pending').length} of ${beneficiaries.length} approved`}
          </div>
        </Link>
      </div>
    </AppShell>
  )
}
