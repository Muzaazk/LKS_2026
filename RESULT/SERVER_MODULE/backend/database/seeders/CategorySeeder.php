<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('categories')->insert([
            'name' => 'Elektronik',
            'description' => 'Produk elektronik seperti HP dan Laptop',
        ]);
        DB::table('categories')->insert([
            'name' => 'Makanan',
            'description' => 'Produk makanan dan minuman',
        ]);
        DB::table('categories')->insert([
            'name' => 'Fashion',
            'description' => 'Pakaian dan aksesoris',
        ]);
    }
}
