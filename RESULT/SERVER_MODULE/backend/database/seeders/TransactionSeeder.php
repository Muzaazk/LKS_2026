<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('transactions')->insert([
            'transaction_code' => 'TRX-20260211-001',
            'transaction_date' => '2026-02-11 10:15:00',
            'total_amount' => 15020000,
            'payment_method' => 'Cash'
        ]);
        DB::table('transactions')->insert([
            'transaction_code' => 'TRX-20260211-002',
            'transaction_date' => '2026-02-11 11:00:00',
            'total_amount' => 170000,
            'payment_method' => 'Transfer'
        ]);
        DB::table('transactions')->insert([
            'transaction_code' => 'TRX-20260211-003',
            'transaction_date' => '2026-02-11 13:30:00',
            'total_amount' => 12000000,
            'payment_method' => 'QRIS'
        ]);
    }
}
