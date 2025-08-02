# シンプルSES収入計算

超シンプルな計算処理。aws maplify gen2 でdynamodb作って、ログイン機能とランキング機能を実装しよう。

## ポートフォリオとしての側面

1. Amplify Gen2 を使用した開発
2. 計10時間程度で作成
3. AI任せな部分
   1. 税金の計算手法
   2. tailwindのクラスネーム
4. コードのリファクタリングなどは積極的に検討
   1. 画面遷移
   2. 認証の有無の制御
   3. クラスネーム調整
5. 今回は規模が小ないので、エディタの設定など、開発環境の整理などはやるまでもなかった。
6. デプロイ時の諸問題への対処などのノウハウ。
   1. amplifyはたまにうまくデプロイできなくなるが、そういった場合の手動対処。
      1. s3やpipelineの削除。

## 課題

dynamo db, graph ql を使用してるときの、データのソート方法。
流石にデータが増えたとき、全件取得してソートなんて…

こまかいボタン配置や、画面遷移の流れには改善の余地があるだろう。
あとはクラッキング対策。多分他の人のデータも消せちゃう？

# Next.js

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
