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

        // transaction_id 

        DB::table('transaction_details')->insert([
            'transaction_id' => 1,
            'product_id' => 1,
            'quantity' => 1,
            'price' => 15000000,
            'subtotal' => 15000000,
        ]);

        DB::table('transaction_details')->insert([
            'transaction_id' => 1,
            'product_id' => 3,
            'quantity' => 2,
            'price' => 10000,
            'subtotal' => 20000,
        ]);

        DB::table('transaction_details')->insert([
            'transaction_id' => 2,
            'product_id' => 5,
            'quantity' => 2,
            'price' => 75000,
            'subtotal' => 150000,
        ]);

        DB::table('transaction_details')->insert([
            'transaction_id' => 2,
            'product_id' => 4,
            'quantity' => 3,
            'price' => 7000,
            'subtotal' => 21000,
        ]);

        DB::table('transaction_details')->insert([
            'transaction_id' => 3,
            'product_id' => 2,
            'quantity' => 1,
            'price' => 12000000,
            'subtotal' => 12000000,
        ]);
    }
}
