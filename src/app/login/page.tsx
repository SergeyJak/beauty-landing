import LoginForm, { type LoginLocale } from '@/components/admin/LoginForm'

export const dynamic = 'force-dynamic'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string | string[] }>
}) {
  const params = await searchParams
  const requested = Array.isArray(params.lang) ? params.lang[0] : params.lang
  const locale: LoginLocale =
    requested === 'ru' || requested === 'en' || requested === 'lv'
      ? requested
      : 'lv'

  return <LoginForm initialLocale={locale} />
}
